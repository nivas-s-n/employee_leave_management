import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EmployeeDashboard = () => {
  return (
    <Container className="mt-4">
      <h2>Employee Dashboard</h2>
      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>Apply for Leave</h5>
              <p>Submit new leave requests</p>
              <Link to="/apply-leave" className="btn btn-primary">Apply Now</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>My Leave History</h5>
              <p>View all your leave requests</p>
              <Link to="/my-leaves" className="btn btn-info">View History</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h5>Leave Balance</h5>
              <p>Check available leaves</p>
              <Link to="/my-balance" className="btn btn-success">Check Balance</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployeeDashboard;