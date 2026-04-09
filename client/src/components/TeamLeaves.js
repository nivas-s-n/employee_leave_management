import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const TeamLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTeamLeaves();
  }, []);

  const fetchTeamLeaves = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/leave-requests/all' : '/leave-requests/team';
      const response = await api.get(endpoint);
      setLeaves(response.data);
    } catch (error) {
      setError('Failed to fetch team leaves');
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/leave-requests/${id}/${action}`);
      fetchTeamLeaves();
    } catch (error) {
      setError(error.response?.data?.error || `Failed to ${action} request`);
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
          <h4>Team Leave Requests</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id}>
                  <td>{leave.employee_name}</td>
                  <td>{leave.dept}</td>
                  <td>{leave.type_name}</td>
                  <td>{new Date(leave.from_date).toLocaleDateString()}</td>
                  <td>{new Date(leave.to_date).toLocaleDateString()}</td>
                  <td>{leave.days_requested}</td>
                  <td>{leave.reason}</td>
                  <td>{statusm(leave.status)}</td>
                  <td>
                    {leave.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAction(leave.id, 'approve')}
                          className="me-1"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleAction(leave.id, 'reject')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">No leave requests found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TeamLeaves;