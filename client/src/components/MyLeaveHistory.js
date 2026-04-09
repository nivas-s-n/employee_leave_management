import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import api from '../api';

const MyLeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/leave-requests/my');
      setLeaves(response.data);
    } catch (error) {
      setError('Failed to fetch leave history');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await api.delete(`/leave-requests/${id}`);
        fetchLeaves();
      } catch (error) {
        setError('Failed to cancel request');
      }
    }
  };

  const statusm = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      cancelled: 'secondary'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4>My Leave History</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id}>
                  <td>{leave.type_name}</td>
                  <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                  <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                  <td>{leave.days_requested}</td>
                  <td>{leave.reason}</td>
                  <td>{statusm(leave.status)}</td>
                  <td>
                    {leave.status === 'pending' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(leave.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No leave requests found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyLeaveHistory;