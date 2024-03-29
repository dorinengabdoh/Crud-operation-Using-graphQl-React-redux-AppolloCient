import React from "react";
import { useDispatch } from "react-redux";
import { EditUserForm } from "../EditUser";
import useUserForm from "./UseUserForm";

const UserAddEdit: React.FC<{ id: string | undefined }> = ({ id }) => {
  const { user, loading, error, handleSubmit } = useUserForm(id);
  const dispatch = useDispatch();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!!error) {
    console.log(error);
    
    return <div className="text-red-600 p-3 text-center border ">{error}</div>;
  }

  return (
    <div>
      <EditUserForm onSubmit={handleSubmit} initialValues={user} />
    </div>
  );
};

export default UserAddEdit;