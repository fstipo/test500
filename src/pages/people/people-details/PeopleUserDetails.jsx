import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify'
import { useUserDetails, useUpdateUser, useRemoveUser } from '../../../hooks/usePeople';
import { dateFormat } from '../../../utils/utils';
import UserForm from '../components/UserForm';
import { basicSchema } from "../../../schemas"
import ModalDelete from '../components/ModalDelete';


const PeopleUserDetails = ({ onChange }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const onSuccessUpdate = () => {
        toast.info("User successfully updated!");
        onChange()
    };

    const onErrorUpdate = () => toast.error("We apologize, but we are unable to update the user at this time.Please try again later.")

    const onSuccessDelete = () => {
        toast.error("User is deleted!");
        navigate("/people");
    }

    const onErrorDelete = () => toast.error("We apologize, but we are unable to delete the user at this time. Please try again later.");

    const [modalShow, setModalShow] = useState(false);
    const { data: userDetail } = useUserDetails(id);
    const { mutateAsync: updateUser } = useUpdateUser(id, onSuccessUpdate, onErrorUpdate);
    const { mutateAsync: removeUser } = useRemoveUser(id, onSuccessDelete, onErrorDelete);

    const formikInitialValues = {
        id: userDetail?.id || '',
        name: userDetail?.name || '',
        sector: userDetail?.sector || '',
        changedAt: dateFormat(userDetail?.changedAt) || ""
    }

    const formikOnSubmit = (values) => {
        if (userDetail?.name !== "" && userDetail?.sector !== "" && userDetail?.name !== values.name || userDetail?.sector !== values.sector) {
            const newData = {
                ...userDetail,
                "name": values.name || userDetail?.name,
                "sector": values.sector || userDetail?.sector
            }
            updateUser(newData)
        }
    }
    const deleteUserHandler = () => {
        removeUser();
    }

    return (
        <>
            <Formik
                initialValues={formikInitialValues}
                enableReinitialize={true}
                validationSchema={basicSchema}
                onSubmit={formikOnSubmit}
            >
                <div className='col-lg-8 col-xl-7 col-xxl-5' >
                    {modalShow && <ModalDelete
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        onDelete={deleteUserHandler}
                    />}
                    <Form autoComplete='off'>
                        <div className='d-flex align-items-center mb-3'>
                            <a className="btn btn-default" onClick={() => navigate("/people")}>
                                <i className="fa fa-chevron-left fa-fw ms-n1"></i>
                                Back
                            </a>
                            <div className="ms-auto">
                                <button type="button" className="btn btn-default me-2" onClick={() => setModalShow(true)}>
                                    Delete
                                </button>
                                <button type="submit" className="btn bg-theme text-white">
                                    Save changes
                                </button>
                            </div>
                        </div>
                        <hr />

                        <UserForm className="bg-gray-100 text-black" label="ID" type="number" name="id" placeholder="id" disabled readOnly />

                        <UserForm label="Full Name" type="text" name="name" placeholder="Full Name" />

                        <UserForm label="Sector" type="text" name="sector" placeholder="Sector" />
                        <hr />
                    </Form>
                </div>
            </Formik >
        </>
    )
}

export default PeopleUserDetails
