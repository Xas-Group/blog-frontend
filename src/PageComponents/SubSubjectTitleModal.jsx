import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";

const SubSubjectTitleModal = ({
  showSubSubjectModal,
  handleCloseSubSubjectModal,
  isUpdating,
  initialFormData,
  selectedMainTitleId,
  refreshSubSubjectsList,
}) => {
  const [subSubjectFormData, setSubSubjectFormData] = useState({
    sub_subject_title: "",
    sub_subject_short_title: "",
    sub_subject_title_order: "",
    main_subject_id: selectedMainTitleId || "",
  });
  const [loading, setLoading] = useState(false);

  // Update form data if initialFormData changes (e.g., in edit mode)
  useEffect(() => {
    if (initialFormData) {
      setSubSubjectFormData(initialFormData);
    }
  }, [initialFormData]);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSubSubjectFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission for Insert or Update
  const handleFormSubmit = async () => {
    setLoading(true);
    try {
      const payload = { 
        sub_subject_title: subSubjectFormData.sub_subject_title,
        sub_subject_short_title: subSubjectFormData.sub_subject_short_title,
        sub_subject_title_order: subSubjectFormData.sub_subject_title_order,
        main_subject_id: selectedMainTitleId, // Ensure this is included
      };

      if (isUpdating) {
        // Update API call
        await axiosInstance.put(
          `/sub-subject-title/${initialFormData.sub_subject_id}`,
          payload
        );
        toast.success("Sub-subject title updated successfully");
      } else {
        // Insert API call
        await axiosInstance.post("/sub-subject-title", payload);
        toast.success("Sub-subject title added successfully");
      }
      refreshSubSubjectsList();
      handleCloseSubSubjectModal();
    } catch (error) {
      console.error("Error saving sub-subject title:", error);
      toast.error("Failed to save sub-subject title. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // Handle deleting the sub-subject title
  const handleDeleteSubSubject = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sub-subject title?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axiosInstance.delete(
        `/sub-subject-title/${initialFormData.sub_subject_id}`
      );
      toast.success("Sub-subject title deleted successfully");
      refreshSubSubjectsList();
      handleCloseSubSubjectModal();
    } catch (error) {
      console.error("Error deleting sub-subject title:", error);
      toast.error("Failed to delete sub-subject title. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Modal show={showSubSubjectModal} onHide={handleCloseSubSubjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isUpdating ? "Update" : "Add"} Sub-Subject Title
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formSubSubjectTitle">
              <Form.Label>Sub-Subject Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Sub-Subject Title"
                name="sub_subject_title"
                value={subSubjectFormData.sub_subject_title}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubSubjectShortTitle">
              <Form.Label>Sub-Subject Short Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Sub-Subject Short Title"
                name="sub_subject_short_title"
                value={subSubjectFormData.sub_subject_short_title}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubSubjectTitleOrder">
              <Form.Label>Sub-Subject Title Order</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Sub-Subject Title Order"
                name="sub_subject_title_order"
                value={subSubjectFormData.sub_subject_title_order}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isUpdating && (
            <Button
              variant="danger"
              onClick={handleDeleteSubSubject}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleCloseSubSubjectModal}
            disabled={loading}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleFormSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdating ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubSubjectTitleModal;
