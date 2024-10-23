import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Image, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";
  import Swal from "sweetalert2";

const SubjectModal = ({
  showSubjectModal,
  handleCloseSubjectModal,
  isUpdating,
  initialFormData = {}, // Default to empty object
  selectedSubjectId,
  refreshSubjectsList,
}) => {
  // Initialize form data
  const [subjectFormData, setSubjectFormData] = useState({
    title: "",
    description: "",
    image: null,
    imagePreview: null,
    order: "",
  });
  const [loading, setLoading] = useState(false);


  // Update form data if initialFormData changes (e.g., in edit mode)
  useEffect(() => {
    if (initialFormData && isUpdating) {
      setSubjectFormData({
        title: initialFormData.subjectName || "",
        description: initialFormData.subjectDescription || "",
        image: null,
        imagePreview: initialFormData.subjectImage
          ? initialFormData.subjectImage
          : null,
        order: initialFormData.subjectOrder || "",
      });
    } else {
      // Reset form data for adding a new subject
      setSubjectFormData({
        title: "",
        description: "",
        image: null,
        imagePreview: null,
        order: "",
      });
    }
  }, [initialFormData, isUpdating]);

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
    if (file) {
      setSubjectFormData((prevData) => ({
        ...prevData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  // Validate form data
  const isFormValid = () => {
    return (
      subjectFormData.title.trim() !== "" &&
      subjectFormData.description.trim() !== "" &&
      subjectFormData.order !== ""
    );
  };

  // Handle form submission (Insert or Update)

  const handleSubjectFormSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append("subjectName", subjectFormData.title);
    formData.append("subjectDescription", subjectFormData.description);
    formData.append("subjectOrder", subjectFormData.order);
    if (subjectFormData.image) {
      formData.append("image", subjectFormData.image);
    }

    try {
      // Check if it's an update request
      if (isUpdating && selectedSubjectId) {
        // Show SweetAlert2 confirmation
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You are about to update the subject.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "Cancel",
        });

        // If confirmed, proceed with the update API call
        if (result.isConfirmed) {
          await axiosInstance.put(`/subject/${selectedSubjectId}`, formData);
          toast.success("Subject updated successfully");

          // Refresh the subjects list and close the modal
          refreshSubjectsList();
          handleCloseSubjectModal();
        }
      } else {
        // Insert API call
        await axiosInstance.post("/subject", formData);
        toast.success("Subject added successfully");

        // Refresh the subjects list and close the modal
        refreshSubjectsList();
        handleCloseSubjectModal();
      }
    } catch (err) {
      console.error("Error in subject operation:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to save subject. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // Handle deleting the subject

  const handleDeleteSubject = async () => {
    if (!selectedSubjectId) {
      toast.error("No subject selected for deletion.");
      return;
    }

    // Show SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    // If the user confirms, proceed with deletion
    if (result.isConfirmed) {
      setLoading(true);

      try {
        await axiosInstance.delete(`/subject/${selectedSubjectId}`);
        toast.success("Subject deleted successfully");

        // Refresh the subjects list and close the modal
        refreshSubjectsList();
        handleCloseSubjectModal();
      } catch (err) {
        console.error("Error deleting subject:", err);
        toast.error(
          err.response?.data?.message ||
            "Failed to delete subject. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <>
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
                required
                disabled={loading}
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
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectImage">
              <Form.Label>Subject Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                disabled={loading}
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
                required
                disabled={loading}
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
          <Button
            variant="secondary"
            onClick={handleCloseSubjectModal}
            disabled={loading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubjectModal;
