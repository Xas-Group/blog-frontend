import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";

const MainTitleModal = ({
  showMainTitleModal,
  handleCloseMainTitleModal,
  isUpdating,
  initialFormData,
  refreshMainTitlesList, // Callback to refresh the main titles list after insert/update/delete
  selectedSubjectId,
}) => {
  const [mainTitleFormData, setMainTitleFormData] = useState({
    main_subject_title: "",
    main_subject_short_title: "",
    main_subject_title_order: "",
    subjectId: selectedSubjectId || "",
  });
  const [loading, setLoading] = useState(false);

  // Update form data if initialFormData changes (e.g., in edit mode)
  useEffect(() => {
    if (initialFormData) {
      setMainTitleFormData(initialFormData);
    }
  }, [initialFormData]);

  // Handle form input changes
  const handleMainTitleFormChange = (e) => {
    const { name, value } = e.target;
    setMainTitleFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for Insert or Update
  const handleMainTitleFormSubmit = async () => {
    setLoading(true);

    const payload = {
      main_subject_title: mainTitleFormData.main_subject_title,
      main_subject_short_title: mainTitleFormData.main_subject_short_title,
      main_subject_title_order: mainTitleFormData.main_subject_title_order,
      subjectId: selectedSubjectId,
    };

    try {
      if (isUpdating) {
        // Update API call
        await axiosInstance.put(
          `/main-subject-title/${initialFormData.main_subject_id}`,
          payload
        );
        toast.success("Main subject title updated successfully");
      } else {
        // Insert API call
        await axiosInstance.post("/main-subject-title", payload);
        toast.success("Main subject title added successfully");
      }
      refreshMainTitlesList(); // Refresh the main titles list
      handleCloseMainTitleModal(); // Close modal
    } catch (error) {
      console.error("Error saving main subject title:", error);
      toast.error("Failed to save main subject title. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting the main subject title
  const handleDeleteMainTitle = async () => {
    setLoading(true);

    try {
      await axiosInstance.delete(
        `/main-subject-title/${initialFormData.main_subject_id}`
      );
      toast.success("Main subject title deleted successfully");
      refreshMainTitlesList(); // Refresh the main titles list
      handleCloseMainTitleModal(); // Close modal
    } catch (error) {
      console.error("Error deleting main subject title:", error);
      toast.error("Failed to delete main subject title. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal show={showMainTitleModal} onHide={handleCloseMainTitleModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isUpdating ? "Update" : "Add"} Main Subject Title
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formMainSubjectTitle">
              <Form.Label>Main Subject Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Main Subject Title"
                name="main_subject_title"
                value={mainTitleFormData.main_subject_title}
                onChange={handleMainTitleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMainSubjectShortTitle">
              <Form.Label>Main Subject Short Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Main Subject Short Title"
                name="main_subject_short_title"
                value={mainTitleFormData.main_subject_short_title}
                onChange={handleMainTitleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMainSubjectTitleOrder">
              <Form.Label>Main Subject Title Order</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Main Subject Title Order"
                name="main_subject_title_order"
                value={mainTitleFormData.main_subject_title_order}
                onChange={handleMainTitleFormChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isUpdating && (
            <Button
              variant="danger"
              onClick={handleDeleteMainTitle}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleCloseMainTitleModal}
            disabled={loading}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleMainTitleFormSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdating ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainTitleModal;
