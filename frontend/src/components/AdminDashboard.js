import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      <Row className="mt-4">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <h5>Manage Leave Types</h5>
              <p>Add or modify leave types</p>
              <Link to="/leave-types" className="btn btn-primary">Manage Types</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <h5>All Leave Requests</h5>
              <p>View all leave requests</p>
              <Link to="/team-leaves" className="btn btn-info">View All</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;