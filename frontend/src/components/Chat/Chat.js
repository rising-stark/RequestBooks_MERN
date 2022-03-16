import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";
import "./Chat.css";

export default function ChatContainer() {
  const id = useParams().id;
  const socket = useRef();
  const navigate = useNavigate();
  const [receiver, setReceiver] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState({message: ""});
  const [cookies] = useCookies();
  const scrollRef = useRef();
  const focusRef = useRef();

  const handleInput = (e) => {
    setInput((prevState) => ({ ...prevState, [e.target.name]: e.target.value,}));
  };

  const getAllChats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/chats`, {
        method: "GET",
        credentials: "include"
      });
      if (res && res.status === 200) {
        const chats = (await res.json()).chats;
        return chats || [];
      }else {
        alert("Server error. Try again later")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getMessages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/chats/${id}`, {
        method: "GET",
        credentials: "include"
      });
      if (res && res.status === 200) {
        const messages = (await res.json()).messages;
        return messages || [];
      }
    } catch (error) {
      console.log(error);
      alert("Server error. Try again later")
    }
  }

  const getBookById = async () => {
    try {
      const res = await fetch(`http://localhost:5000/books/${id}`, {
        method: "GET",
        credentials: "include"
      });
      let book;
      if (res && res.status === 200) {
        const book = (await res.json()).book;
        return book;
      }
      if(book === undefined)
        navigate("/chats");
    } catch (error) {
      console.log(error);
      alert("Server error. Try again later")
    }
  }

  useEffect(() => {
    getAllChats().then((data) => setChats(data));
  }, []);

  useEffect(() => {
    if(id){
      setMessages([]);
      getBookById().then((data) => {
        if(cookies.usertype === "user")
          setReceiver(data.handledby)
        else
          setReceiver(data.requestedby)
      });
      socket.current = io("http://localhost:5000/");
      socket.current.emit("addUser", cookies.username);
      getMessages().then((data) => setMessages(data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
      const {message} = input;

      const res = await fetch(`http://localhost:5000/chats/${id}`, {
        method: "POST",
        credentials: "include",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({message})
      });
      const msg = (await res.json()).msg;
      if(res && res.status === 200){
        const msgs = [...messages];
        socket.current.emit("sendMsg", msg);
        msgs.push(msg);
        setMessages(msgs);
        setInput({message: ""});
      }
      if(msg === undefined)
        alert("Message could not be delivered. Try again after sometime")
    } catch (error) {
      console.log(error);
      alert("Server error. Message could not be delivered. Try again after sometime")
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msgReceive", (message) => {
        const msgs = [...messages];
        msgs.push(message);
        setMessages(msgs);
      });
    }
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    focusRef.current?.focus();
  }, [messages]);

  return (
    <div className="container">
      <div className="row justify-content-center my-4 h-550">
        <div className="col-md-3 border p-0">
          <h4 className="header border-bottom m-0 text-center">All chats</h4>
          <div className="bg-info bg-opacity-10 maxh-500 overflow-auto p-0">
            {
              chats.length === 0?
                <div className="my-4 py-4 text-center">No chats yet.</div>
              :
                <div>
                  {
                    chats.map((chat) => {
                      return (
                        <NavLink key={chat.bookid} to={"/chats/" + chat.bookid} className={`p-2 btn bg-opacity-10 rounded text-start m-1 border-primary ${chat.bookid === id? "btn-success" : "btn-light"}`}>
                          <span>Chat with: {chat.username} regarding {chat.bookid}</span>
                        </NavLink>
                      );
                    })
                  }
                </div>
            }
          </div>
        </div>
        <div className="col-md-6 border p-0 overflow-hidden">
          {
            id?
            <div>
              <h4 className="header border-bottom bg-light p-1 rounded-2 text-center">Chatting with: <span className="bg-warning rounded-pill p-1">{receiver}</span> for book request <span className="bg-primary bg-opacity-50 rounded-pill p-1">{id}</span></h4>
              <div className="bg-primary bg-opacity-10 maxh-400 overflow-auto p-1">
                {
                  messages.length === 0?
                    <h4 className="my-4 py-4 text-center">No messages yet. Start a conversation</h4>
                  :
                    <>
                      {
                        messages.map((message, index) => {
                          let selfMsg = message.sender === cookies.username;
                          return (
                            <div ref={scrollRef} key={index} className={`position-relative w-100 ${selfMsg? "text-end" : ""}`}>
                              <div className={`msgContainer maxw-75 ${selfMsg? "bg-info rounded-right" : "bg-warning rounded-left"} bg-opacity-75 px-3 d-inline-block`}>
                                <div className="msg text-start" style={{whiteSpace: "pre-line"}}>{message.message}</div>
                                <div className="msgTime text-muted text-end">{message.timestamp}</div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </>
                }
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="d-flex border border-4 rounded">
                    <textarea ref={focusRef} type="text" name="message" className="p-2 w-100 rounded border-0" placeholder="type your message here..." onChange={handleInput} value={input.message} rows="1" required autoFocus></textarea>
                    <button type="submit" className="btn btn-primary col-2">
                      Send <i className="fa fa-send" aria-hidden="true"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            :
              chats.length === 0?
                <div className="bg-primary bg-opacity-10 h-100 text-center">
                  <h4 className="py-5 text-center">No chats started</h4>
                </div>
              :
                <div className="bg-primary bg-opacity-10 h-100 text-center">
                  <h4 className="py-5 text-center">Please select a chat to start messaging.</h4>
                  <img src="/assets/chat.png" alt="startChat" className="w-50 mt-1" />
                </div>
          }
        </div>
      </div>
    </div>
  );
}
