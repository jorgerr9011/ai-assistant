"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, Key, useEffect, useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { Chat } from "@/types/Chat";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Usuario } from "@/types/User";
import ConfirmDialog from "@/components/confirm";
import { DesplegableIcon } from "@/components/icons/DesplegableIcon";
import { ChatsIcon } from "@/components/icons/chats/ChatsIcon";
import { CreateChatIcon } from "./icons/chats/CreateChatIcon";
import { PreviousPageIcon } from "./icons/chats/PreviousPageIcon";
import { NextPageIcon } from "./icons/chats/NextPageIcon";
import { EditChatIcon } from "./icons/chats/EditChatIcon";
import { DeleteChatIcon } from "./icons/chats/DeleteChatIcon";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { usuario, isLoading } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setisLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  const [showModalNew, setShowModalNew] = useState(false);
  const [showModalDel, setShowModalDel] = useState(false);

  const [messageNew] = useState(
    "Confirma para crear una nueva conversación por favor"
  );
  const [messageDel] = useState(
    "Confirma para borrar la conversación por favor"
  );
  const [messageEdit] = useState(
    "Por favor, introduzca el nuevo título para la conversación"
  );

  const [deleteChat, setDeleteChat] = useState<String>();
  const [editChat, setEditChat] = useState<String>();

  const [title, setTitle] = useState<String>("");

  const [showEdit, setShowEdit] = useState(false);

  const [desplegable, setDesplegable] = useState<string>("70%");

  const nextPage = () => {
    if (chats.length > currentPage + 5) {
      setCurrentPage(currentPage + 5);
    } else if (chats.length > currentPage + 5) {
      setCurrentPage(currentPage + 5);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 5);
  };

  const filteredChats = (): Chat[] => {
    let listChats: Chat[] = chats;

    return listChats.slice(currentPage, currentPage + 5);
  };

  const handleModalNew = async () => {
    setShowModalNew(true);
  };

  const handleModalDel = async (chatId: String) => {
    setShowModalDel(true);
    setDeleteChat(chatId);
  };

  const handleCancelModalNew = () => {
    setShowModalNew(false);
  };

  const handleCancelModalDel = () => {
    setShowModalDel(false);
  };

  const handleCancelModalEdit = () => {
    setShowEdit(false);
  };

  const handleModalEdit = (chatId: String) => {
    setShowEdit(true);
    setEditChat(chatId);
  };

  const handleNewChat = async () => {
    let count = 1 + chats.length;

    const chat = {
      title: "titulo " + count,
      chat_history: [],
      user: usuario._id,
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(chat),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const nuevoChat = await res.json();

    if (res.status === 200) {
      router.push(`/chat/${nuevoChat._id}`);
      router.refresh();

      setCurrentPage(0);
      setReload(!reload);
      setIsOpen(false);
      setShowModalNew(false);
    }
  };

  const handleDelete = async (chatId: String | undefined) => {
    const res = await fetch(`/api/chat/${chatId}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      router.refresh();
      router.push("/chat");

      setCurrentPage(0);
      setReload(!reload);
      setIsOpen(false);

      setShowModalDel(false);
    }
  };

  const handleChangeTitle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(e.target.value);
    setTitle(e.target.value);
  };

  const getChat = async () => {
    const resGet = await fetch(`/api/chat/${editChat}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const chat = await resGet.json();
    return chat as Chat;
  };

  const handleEdit = async (event: FormEvent) => {
    event?.preventDefault();

    let chat = await getChat();
    chat.title = title as string;

    try {
      const resUpdate = await fetch(`/api/chat/${editChat}`, {
        method: "PUT",
        body: JSON.stringify(chat),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resUpdate.status === 200) {
        setCurrentPage(0);
        setReload(!reload);
        setIsOpen(false);

        setShowEdit(false);
      }
    } catch (error: any) {
      console.log("Error message: " + error.message);
    }
  };

  const handleDesplegable = () => {
    setDesplegable(desplegable === "70%" ? "25%" : "70%");
  };

  useEffect(() => {
    async function getData(usuarioId: String) {
      const res = await fetch(`/api/chat?user=${usuarioId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const chats = await res.json();

      setChats(chats);
      setisLoading(false);
    }

    if (session?.user) {
      const usuario = session?.user as Usuario;
      getData(String(usuario._id));
    }
  }, [session, reload]);

  return (
    <>
      {isLoading === false && loading === false ? (
        <>
          {showModalNew === true ? (
            <ConfirmDialog
              message={messageNew}
              onConfirm={handleNewChat}
              onCancel={handleCancelModalNew}
            />
          ) : (
            <></>
          )}

          {showModalDel === true ? (
            <ConfirmDialog
              message={messageDel}
              onConfirm={() => handleDelete(deleteChat)}
              onCancel={handleCancelModalDel}
            />
          ) : (
            <></>
          )}

          {showEdit === true ? (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <form onSubmit={handleEdit}>
                <div className="bg-gray-400 rounded-lg shadow-md p-8">
                  <p className="mb-6">{messageEdit}</p>
                  <div className="flex flex-col justify-end mb-8">
                    <input
                      onChange={handleChangeTitle}
                      name="title"
                      type="text"
                      className="rounded-md mb-8 p-2 flex-grow w-full border border-gray-400 focus:border-red-400"
                    />

                    <div className="flex flex-row">
                      <button
                        onClick={handleCancelModalEdit}
                        className="bg-gray-400 hover:bg-gray-500 rounded-md px-4 py-2 mr-2"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-black rounded-md px-4 py-2"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <></>
          )}

          <div
            className="container sm:col-span-0 md:col-span-2 md:w-8/12 w-0 mr-12 rounded gap-4 mb-8 opacity-75 bg-blue-200"
            style={{ width: desplegable, height: "85vh" }}
          >
            <div className="flex justify-start w-12 transition ml-6 mt-10 mr-2 hover:scale-110">
              <button
                onClick={handleDesplegable}
                className="rounded-full p-3 h-12 hover:bg-pink-400"
              >
                <DesplegableIcon />
              </button>
            </div>
            <div
              className="flex flex-col my-6 mr-2 h-16 gap-8"
              style={{ width: desplegable }}
            >
              <div className="flex pl-6 justify-start sm:justify-start h-16">
                <button
                  onClick={handleModalNew}
                  className="text-black font-semibold p-3 hidden md:block rounded-lg hover:bg-pink-400"
                >
                  <p className="flex justify-center">
                    <CreateChatIcon />
                    {desplegable === "70%" ? <>Crear chat</> : <></>}
                  </p>
                </button>
              </div>

              <div className="flex flex-1 flex-col pl-6 justify-start sm:justify-start h-16">
                <div>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-black font-semibold p-3 md:block hidden rounded-lg hover:bg-pink-400"
                  >
                    <p className="flex justify-center">
                      <ChatsIcon />
                      {desplegable === "70%" ? <>Mis chats</> : <></>}
                    </p>
                  </button>
                </div>
                {isOpen && (
                  <div className="flex flex-col mx-auto ml-2 justify-center sm:justify-center align-center mt-4">
                    <div className="flex flex-col gap-4">
                      {chats.length > 0 &&
                        filteredChats().map((item: Chat) => (
                          <li
                            className="flex items-center gap-2"
                            key={item._id as unknown as Key}
                          >
                            <Link
                              href={`/chat/${item._id}`}
                              className="p-3 hidden md:block text-black font-semibold rounded-lg hover:bg-blue-400"
                            >
                              {" "}
                              {item.title}{" "}
                            </Link>
                            <Link
                              href="/chat/"
                              onClick={() =>
                                handleModalDel(item._id as unknown as String)
                              }
                              className="hidden md:block rounded-xl hover:bg-blue-500"
                            >
                              <DeleteChatIcon />
                            </Link>
                            <button
                              onClick={() =>
                                handleModalEdit(item._id as unknown as String)
                              }
                              className="hidden md:block rounded-xl hover:bg-blue-500"
                            >
                              <EditChatIcon />
                            </button>
                          </li>
                        ))}
                    </div>

                    <div className="flex flex-row mt-2">
                      <button
                        onClick={previousPage}
                        className="button button-primary md:block hidden rounded-xl m-4 hover:bg-blue-500"
                      >
                        <PreviousPageIcon />
                      </button>
                      <label className="mt-4 md:block hidden">
                        {" "}
                        {currentPage / 5}{" "}
                      </label>
                      <button
                        onClick={nextPage}
                        className="button button-primary md:block hidden rounded-xl m-4 hover:bg-blue-500"
                      >
                        <NextPageIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>{/*<Loading />*/}</>
      )}
    </>
  );
}
