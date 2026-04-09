import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import api from '../api';

const LeaveTypesAdmin = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    type_name: '',
    max_days_per_year: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await api.get('/leave-types');
      setLeaveTypes(response.data);
    } catch (error) {
      setError('Failed to fetch leave types');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddClick = () => {
    setIsEditing(false);
    setFormData({ type_name: '', max_days_per_year: '' });
    setCurrentId(null);
    setShowModal(true);
  };

  const handleEditClick = (type) => {
    setIsEditing(true);
    setFormData({ type_name: type.type_name, max_days_per_year: type.max_days_per_year });
    setCurrentId(type.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      setError('');
      setSuccess('');
      try {
        await api.delete(`/leave-types/${id}`);
        setSuccess('Leave type deleted successfully!');
        fetchLeaveTypes();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete leave type');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await api.put(`/leave-types/${currentId}`, formData);
        setSuccess('Leave type updated successfully!');
      } else {
        await api.post('/leave-types', formData);
        setSuccess('Leave type added successfully!');
      }
      fetchLeaveTypes();
      setShowModal(false);
      setFormData({ type_name: '', max_days_per_year: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || `Failed to ${isEditing ? 'update' : 'add'} leave type`);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Manage Leave Types</h4>
          <Button variant="primary" onClick={handleAddClick}>
            Add Leave Type
          </Button>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Leave Type</th>
                <th>Max Days Per Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveTypes.map((type, index) => (
                <tr key={type.id}>
                  <td>{index + 1}</td>
                  <td>{type.type_name}</td>
                  <td>{type.max_days_per_year}</td>
                  <td>
                    <Button variant="secondary" size="sm" className="me-2" onClick={() => handleEditClick(type)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(type.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Leave Type' : 'Add New Leave Type'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type Name</Form.Label>
              <Form.Control
                type="text"
                name="type_name"
                value={formData.type_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Days Per Year</Form.Label>
              <Form.Control
                type="number"
                name="max_days_per_year"
                value={formData.max_days_per_year}
                onChange={handleChange}
                required
                min="1"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Update Leave Type' : 'Add Leave Type'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default LeaveTypesAdmin;