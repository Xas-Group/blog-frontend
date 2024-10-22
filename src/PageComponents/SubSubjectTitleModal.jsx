import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";

const SubSubjectTitleModal = ({
  showSubSubjectModal,
  handleCloseSubSubjectModal,
  isUpdating,
  initialFormData = {},
  selectedMainTitleId,
  refreshSubSubjectsList,
  selectedSubTitleId,
}) => {
  // Initialize form data with default values
 const [subSubjectFormData, setSubSubjectFormData] = useState({
   sub_subject_title: initialFormData.sub_subject_title || "",
   sub_subject_short_title: initialFormData.sub_subject_short_title || "",
   sub_subject_title_order: initialFormData.sub_subject_title_order || "",
   main_subject_id:
     selectedMainTitleId || initialFormData.main_subject_id || "",
 });

  const [loading, setLoading] = useState(false);

  // Update form data if initialFormData changes (e.g., in edit mode)
 useEffect(() => {
   setSubSubjectFormData({
     sub_subject_title: initialFormData.sub_subject_title || "",
     sub_subject_short_title: initialFormData.sub_subject_short_title || "",
     sub_subject_title_order: initialFormData.sub_subject_title_order || "",
     main_subject_id:
       selectedMainTitleId || initialFormData.main_subject_id || "",
   });
 }, [initialFormData, selectedMainTitleId, isUpdating]);


  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSubSubjectFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data
 const isFormValid = () => {
   const {
     sub_subject_title,
     sub_subject_short_title,
     sub_subject_title_order,
     main_subject_id,
   } = subSubjectFormData;
   return (
     sub_subject_title.trim() !== "" &&
     sub_subject_short_title.trim() !== "" &&
     sub_subject_title_order.trim() !== "" &&
     main_subject_id !== ""
   );
 };


  // Handle form submission for insert or update
  const handleFormSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    const payload = { ...subSubjectFormData };

    try {
      if (isUpdating && selectedSubTitleId) {
        // Update API call
        await axiosInstance.put(
          `/sub-subject-title/${selectedSubTitleId}`,
          payload
        );
        toast.success("Sub-subject title updated successfully");
      } else {
        // Insert API call
        await axiosInstance.post("/sub-subject-title", payload);
        toast.success("Sub-subject title added successfully");
      }

      // Refresh the list and close the modal
      refreshSubSubjectsList();
      handleCloseSubSubjectModal();
    } catch (error) {
      console.error("Error saving sub-subject title:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save sub-subject title. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // Handle deleting the sub-subject title
  const handleDeleteSubSubject = async () => {
    if (!selectedSubTitleId) {
      toast.error("No sub-subject selected for deletion.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this sub-subject title?"
    );
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await axiosInstance.delete(`/sub-subject-title/${selectedSubTitleId}`);
      toast.success("Sub-subject title deleted successfully");

      // Refresh the list and close the modal
      refreshSubSubjectsList();
      handleCloseSubSubjectModal();
    } catch (error) {
      console.error("Error deleting sub-subject title:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete sub-subject title. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
