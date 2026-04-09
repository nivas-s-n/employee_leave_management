import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/dashboard">Leave Management System</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            {user?.role === 'employee' && (
              <>
                <Nav.Link as={Link} to="/apply-leave">Apply Leave</Nav.Link>
                <Nav.Link as={Link} to="/my-leaves">My Leaves</Nav.Link>
                <Nav.Link as={Link} to="/my-balance">Leave Balance</Nav.Link>
              </>
            )}
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <Nav.Link as={Link} to="/team-leaves">Team Leaves</Nav.Link>
            )}
            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/leave-types">Manage Leave Types</Nav.Link>
            )}
          </Nav>
          <Nav>
            <span className="navbar-text me-3">
              Welcome, {user?.name} ({user?.role})
            </span>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;