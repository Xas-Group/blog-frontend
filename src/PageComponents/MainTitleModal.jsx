import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";

const MainTitleModal = ({
  showMainTitleModal = false,
  handleCloseMainTitleModal = () => {},
  isUpdating = false,
  initialFormData = {},
  refreshMainTitlesList = () => {},
  selectedSubjectId = null,
  selectedMainTitleId = null,
}) => {
  const [mainTitleFormData, setMainTitleFormData] = useState({
    main_subject_title: initialFormData.main_subject_title || "",
    main_subject_short_title: initialFormData.main_subject_short_title || "",
    main_subject_title_order: initialFormData.main_subject_title_order || "",
    subjectId: selectedSubjectId || initialFormData.subjectId || "",
    publishStatus: initialFormData.publishStatus || "onhold", // Default to 'onhold'
  });

  const [loading, setLoading] = useState(false);

  // Update form data if initialFormData changes (e.g., in edit mode)
  useEffect(() => {
    if (initialFormData && isUpdating) {
      setMainTitleFormData({
        main_subject_title: initialFormData.main_subject_title || "",
        main_subject_short_title:
          initialFormData.main_subject_short_title || "",
        main_subject_title_order:
          initialFormData.main_subject_title_order || "",
        subjectId: selectedSubjectId || initialFormData.subjectId || "",
        publishStatus: initialFormData.publishStatus || "onhold",
      });
    } else {
      setMainTitleFormData((prevData) => ({
        ...prevData,
        subjectId: selectedSubjectId || "",
        publishStatus: "onhold",
      }));
    }
  }, [initialFormData, selectedSubjectId, isUpdating]);

  // Handle form input changes
  const handleMainTitleFormChange = (e) => {
    const { name, value } = e.target;
    setMainTitleFormData((prevData) => ({
      ...prevData,
      [name]: name === "main_subject_title_order" ? parseInt(value, 10) : value,
    }));
  };

  // Validate form data
  const isFormValid = () => {
    const {
      main_subject_title,
      main_subject_short_title,
      main_subject_title_order,
      subjectId,
      publishStatus,
    } = mainTitleFormData;

    return (
      main_subject_title.trim() !== "" &&
      main_subject_short_title.trim() !== "" &&
      !isNaN(main_subject_title_order) &&
      main_subject_title_order > 0 &&
      subjectId !== "" &&
      publishStatus !== ""
    );
  };

  // Handle form submission for insert or update
  const handleMainTitleFormSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill out all fields correctly.");
      return;
    }

    setLoading(true);

    const payload = { ...mainTitleFormData };

    try {
      // Check if it's an update request
      if (isUpdating && selectedMainTitleId) {
        // Show SweetAlert2 confirmation
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You are about to update the main subject title.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "Cancel",
        });

        // If confirmed, proceed with the update API call
        if (result.isConfirmed) {
          await axiosInstance.put(
            `/main-subject-title/${selectedMainTitleId}`,
            payload
          );
          toast.success("Main subject title updated successfully");

          // Refresh main titles list and close modal
          refreshMainTitlesList();
          handleCloseMainTitleModal();
        }
      } else {
        // Insert API call
        await axiosInstance.post("/main-subject-title", payload);
        toast.success("Main subject title added successfully");

        // Refresh main titles list and close modal
        refreshMainTitlesList();
        handleCloseMainTitleModal();
      }
    } catch (error) {
      console.error("Error saving main subject title:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save main subject title. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting the main subject title
  const handleDeleteMainTitle = async () => {
    if (!selectedMainTitleId) {
      toast.error("No main subject title selected for deletion.");
      return;
    }

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

    if (result.isConfirmed) {
      setLoading(true);

      try {
        await axiosInstance.delete(
          `/main-subject-title/${selectedMainTitleId}`
        );
        toast.success("Main subject title deleted successfully");

        // Refresh main titles list and close modal
        refreshMainTitlesList();
        handleCloseMainTitleModal();
      } catch (error) {
        console.error("Error deleting main subject title:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to delete main subject title. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPublishStatus">
              <Form.Label>Publish Status</Form.Label>
              <Form.Select
                name="publishStatus"
                value={mainTitleFormData.publishStatus}
                onChange={handleMainTitleFormChange}
                disabled={loading}
                required
              >
                <option value="publish">Publish</option>
                <option value="onhold">On Hold</option>
              </Form.Select>
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
            variant="primary"
            onClick={handleMainTitleFormSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : isUpdating ? "Update" : "Save"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCloseMainTitleModal}
            disabled={loading}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainTitleModal;
