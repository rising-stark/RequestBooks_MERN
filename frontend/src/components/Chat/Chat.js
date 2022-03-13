import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const handleInput = (e) => {
    setInput((prevState) => ({ ...prevState, [e.target.name]: e.target.value,}));
  };

  const getAllChats = async () => {
    try {
      const res = await fetch(`http://localhost:5000/chats`, {
        method: "GET",
        credentials: "include"
      });
      console.log(res.status);
      if (res && res.status === 200) {
        const chats = (await res.json()).chats;
        console.log("here printing chats");
        console.log(chats);
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
      console.log(res.status);
      if (res && res.status === 200) {
        const messages = (await res.json()).messages;
        console.log(messages);
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
      console.log(res.status);
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
      getBookById().then((data) => {
        if(cookies.usertype === "user")
          setReceiver(data.handledby)
        else
          setReceiver(data.requestedby)
      });
      socket.current = io("http://localhost:5000/");
      socket.current.emit("addUser", cookies.username);
      setChats(chats.push(receiver));
      getMessages().then((data) => setMessages(data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    try{
      e.preventDefault();
      const {message} = input;
      socket.current.emit("sendMsg", {receiver, message});

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
        console.log("msg delivered successfully");
        console.log(msg)
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message });
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
        msgs.push({ message });
        setMessages(msgs);
      });
    }
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container">
      <div className="row justify-content-center my-4">
        {/* <div className="col-md-3 border p-0"> */}
        {/*   <h4 className="header border-bottom">All chats</h4> */}
        {/*   <div className="bg-info bg-opacity-10 h-400 overflow-auto"> */}
        {/*     { */}
        {/*       chats.length === 0? */}
        {/*         <div className="my-4 py-4 text-center">No chats yet.</div> */}
        {/*       : */}
        {/*         <> */}
        {/*           { */}
        {/*             chats.map((chat) => { */}
        {/*               return ( */}
        {/*                 <div key={chat.bookid}> */}
        {/*                   <div className="content my-1"> */}
        {/*                     <div>{chat.bookid}</div> */}
        {/*                   </div> */}
        {/*                 </div> */}
        {/*               ); */}
        {/*             }) */}
        {/*           } */}
        {/*         </> */}
        {/*     } */}
        {/*   </div> */}
        {/* </div> */}
        <div className="col-md-5 border p-0">
          {
            id?
            <>
              <h4 className="header border-bottom bg-light p-1 rounded-2 text-center">Chatting with: <span className="bg-warning rounded-pill p-1">{receiver}</span></h4>
              <div className="bg-primary bg-opacity-10 h-400 overflow-auto p-1">
                {
                  messages.length === 0?
                    <h4 className="my-4 py-4 text-center">No messages yet. Start a conversation</h4>
                  :
                    <>
                      {
                        messages.map((message, index) => {
                          let selfMsg = message.fromSelf || (message.sender === cookies.username);
                          return (
                            <div ref={scrollRef} key={index} className={`position-relative w-100 ${selfMsg? "text-end" : ""}`}>
                              <div className={`msgContainer ${selfMsg? "bg-info" : "bg-warning"} bg-opacity-75 px-3 rounded-pill d-inline-block`}>
                                <div className="msg text-start">{message.message}</div>
                                {/* <div className="msgTime text-muted text-end">{message.timestamp}</div> */}
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
                    <textarea autoFocus type="text" name="message" className="p-2 w-100 rounded border-0" placeholder="type your message here..." onChange={handleInput} value={input.message} rows="1" required></textarea>
                    <button type="submit" className="btn btn-primary col-2">
                      Send <i className="fa fa-send" aria-hidden="true"></i>
                    </button>
                  </div>
                </form>
              </div>
            </>
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
