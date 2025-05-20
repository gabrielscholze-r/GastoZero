import {MdClose, MdDelete} from "react-icons/md";
import React, {useEffect, useState} from "react";
import {deletePlan, updatePlan} from "./Actions.jsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {usePlans} from "../../hooks/usePlans.jsx";

export default function PlanEdit({isOpened, setIsOpened, data}) {
    const { refetch } = usePlans();
    const navigate = useNavigate();
    const [del, setDel] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setName(data.name);
        setDescription(data.description);
    }, [data]);


    const handleSave = async () => {
        if (del) {
            const result = await deletePlan(data.id);
            if (result) {
                setIsOpened(false);
                toast.success('Plan has been deleted successfully!');
                await refetch();
                navigate('/home');
            }
        }
        if (data.name !== name || data.description !== description) {
            data.name=name;
            data.description=description;
            const result = await updatePlan(data);
            if (result) {
                setIsOpened(false);
                toast.success('Plan has been updated successfully!');
                navigate('/plan');
            }
        }

    }


    if (!isOpened) return null;

    return (
        <div
            className="w-full h-full fixed top-0 left-0 bg-black/50 bg-opacity-50 z-[99999] flex justify-center items-center">
            <div className="fixed w-1/2 h-max bg-containerbg rounded p-5 justify-center items-center z-[99999]">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">Edit Plan</h1>
                    <button className="cursor-pointer hover:rotate-90 transition hover:text-red-500 hover:scale-110"
                            onClick={() => {
                                setIsOpened(false);
                            }}
                    >
                        <MdClose
                            size={30}

                        />
                    </button>
                </div>
                <div className="flex flex-col gap-4 align-middle justify-center h-9/12 mt-5">
                    <div className="w-11/12 mx-auto">
                        <h1 className="my-1">Change Name</h1>
                        <input type="text" placeholder="Name" value={name} className="w-full px-2 py-1 border-2 border-gold rounded bg-blue-dark"
                               onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="w-11/12 mx-auto">
                        <h1 className="my-1">Change Description</h1>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full px-2 py-1 border-2 border-gold rounded bg-blue-dark"
                        />
                    </div>
                    <button className={`w-11/12 mx-auto cursor-pointer rounded p-4 bg-red-500 text-white hover:scale-105 transition-transform ${del && "opacity-50"}`} onClick={() => setDel(!del)}>
                        <div className="flex justify-center items-center gap-2">
                            <h1 className="text-xl">Delete</h1>
                            <MdDelete size={20}/>
                        </div>
                    </button>
                    {del && (
                        <h1 className={`text-center mx-auto text-red-400 text-xl font-extrabold`}>Warning! Plan will be deleted</h1>
                    )}
                    <button className="w-11/12 mt-auto bg-bglight py-4 rounded mx-auto cursor-pointer hover:scale-105 transition-transform" onClick={handleSave}>
                        <h1 className="text-2xl">Save</h1>
                    </button>
                </div>

            </div>
        </div>
    );
}