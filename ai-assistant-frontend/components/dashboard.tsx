"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, Key, useEffect, useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { Chat } from "@/types/Chat";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Usuario } from "@/types/User";
import ConfirmDialog from "@/components/confirm";

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                      />
                    </svg>
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
                      <svg
                        className="mr-2 h-5 text-black"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" />
                      </svg>
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
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </Link>
                            <button className="hidden md:block rounded-xl hover:bg-blue-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() =>
                                  handleModalEdit(item._id as unknown as String)
                                }
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                    </div>

                    <div className="flex flex-row mt-2">
                      <button
                        onClick={previousPage}
                        className="button button-primary md:block hidden rounded-xl m-4 hover:bg-blue-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                          />
                        </svg>
                      </button>
                      <label className="mt-4 md:block hidden">
                        {" "}
                        {currentPage / 5}{" "}
                      </label>
                      <button
                        onClick={nextPage}
                        className="button button-primary md:block hidden rounded-xl m-4 hover:bg-blue-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                          />
                        </svg>
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
