import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Alert } from 'react-bootstrap';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const LeaveBalance = () => {
  const [balances, setBalances] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const response = await api.get(`/leave-balances/${user.id}`);
      setBalances(response.data);
    } catch (error) {
      setError('Failed to fetch leave balance');
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4>Leave Balance for {new Date().getFullYear()}</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Total Days</th>
                <th>Used Days</th>
                <th>Remaining Days</th>
              </tr>
            </thead>
            <tbody>
              {balances.map(balance => (
                <tr key={balance.id}>
                  <td>{balance.type_name}</td>
                  <td>{balance.total_days}</td>
                  <td>{balance.used_days}</td>
                  <td>
                    <strong className={balance.remaining_days < 5 ? 'text-danger' : 'text-success'}>
                      {balance.remaining_days}
                    </strong>
                  </td>
                </tr>
              ))}
              {balances.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No leave balances found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LeaveBalance;