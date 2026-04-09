import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  return (
    <Container className="mt-4">
      <h2>Manager Dashboard</h2>
      <Row className="mt-4">
        <Col md={12}>
          <Card className="text-center">
            <Card.Body>
              <h5>Team Leave Requests</h5>
              <p>Review and manage team leave requests</p>
              <Link to="/team-leaves" className="btn btn-primary">View Team Leaves</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerDashboard;