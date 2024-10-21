import React, { useState } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";

const SubjectModal = ({
  showSubjectModal,
  handleCloseSubjectModal,
  isUpdating,
  initialFormData,
  refreshSubjectsList, 
}) => {
  const [subjectFormData, setSubjectFormData] = useState(
    initialFormData || {
      title: "",
      description: "",
      image: null,
      imagePreview: null,
      order: "",
    }
  );

  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleSubjectFormChange = (e) => {
    const { name, value } = e.target;
    setSubjectFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSubjectFormData((prevData) => ({
      ...prevData,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : null,
    }));
  };

  // Handle form submission (Insert or Update)
  const handleSubjectFormSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("subjectName", subjectFormData.title);
    formData.append("subjectDescription", subjectFormData.description);
    formData.append("subjectOrder", subjectFormData.order);
    if (subjectFormData.image) {
      formData.append("image", subjectFormData.image);
    }

    try {
      if (isUpdating) {
        // Update API call
        await axiosInstance.put(`/subject/${initialFormData.id}`, formData);
        toast.success("Subject updated successfully");
      } else {
        // Add API call
        await axiosInstance.post("/subject", formData);
        toast.success("Subject added successfully");
      }
      refreshSubjectsList(); // Refresh the subject list after insert/update
      handleCloseSubjectModal(); // Close modal
    } catch (err) {
      console.error("Error in subject operation:", err);
      toast.error("Failed to save subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting the subject
  const handleDeleteSubject = async () => {
    setLoading(true);

    try {
      await axiosInstance.delete(`/subject/${initialFormData.id}`);
      toast.success("Subject deleted successfully");
      refreshSubjectsList(); // Refresh the subject list after deletion
      handleCloseSubjectModal(); // Close modal
    } catch (err) {
      console.error("Error deleting subject:", err);
      toast.error("Failed to delete subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal show={showSubjectModal} onHide={handleCloseSubjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdating ? "Update" : "Add"} Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formSubjectTitle">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Subject Name"
                name="title"
                value={subjectFormData.title}
                onChange={handleSubjectFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter description"
                name="description"
                value={subjectFormData.description}
                onChange={handleSubjectFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectImage">
              <Form.Label>Subject Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {subjectFormData.imagePreview && (
                <div className="mt-3">
                  <Image
                    src={subjectFormData.imagePreview}
                    alt="Subject Preview"
                    thumbnail
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectOrder">
              <Form.Label>Subject Order</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter subject order"
                name="order"
                value={subjectFormData.order}
                onChange={handleSubjectFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isUpdating && (
            <Button
              variant="danger"
              onClick={handleDeleteSubject}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleCloseSubjectModal}
            disabled={loading}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubjectFormSubmit}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : isUpdating ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubjectModal;
