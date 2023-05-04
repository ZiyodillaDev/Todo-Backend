const http = require("http");

// Imported models
const Todo = require("./models/Todo");

// Imported utils
const Io = require("./utils/Io");
const bodyParser = require("./utils/parser");

// Imported db
const Todos = new Io("./src/db/todos.json");

// Request and Response
let request = async (req, res) => {
  // Access to Frontend
  res.setHeader("Content-Type", "application/json");

  // Todo => Method POST
  if (req.url === "/" && req.method === "POST") {
    req.body = await bodyParser(req);
    const text = req.body.text
    const title = req.body.title
    const id = req.body.id

    // If text is not available
    if (!text) {
      res.writeHead(401);
      res.end(JSON.stringify({ message: "Text is required" }));
    }

    // // If title is not available
    if (!title) {
      res.writeHead(401);
      res.end(JSON.stringify({ message: "Title is required" }));
    }

    // // If Id is not available
    if (!id) {
      res.writeHead(401);
      res.end(JSON.stringify({ message: "Id is required" }));
    }
    // If everything is available
    else {
        console.log(req.body);
      const todos = await Todos.read();
      const date = new Date();
      const isCompleted = "Process";
      const newTodo = new Todo(id, date, text, title, isCompleted);
      const data = todos.length ? [...todos, newTodo] : [newTodo];
      Todos.write(data);
      res.writeHead(201);
      res.end(JSON.stringify({ success: true }));
    }
  }

  // Todo => Method GET
  if (req.url === "/" && req.method === "GET") {
    const todos = await Todos.read();

    //  When there is no data
    if (todos.length <= 0) {
      res.end(JSON.stringify({ message: "No data available" }));
    }
    // When data is available
    else {
      res.end(JSON.stringify(todos));
    }
  }

  // Todo => Method PUT
  if (req.url === "/" && req.method === "PUT") {
    req.body = await bodyParser(req);
    let id = req.body.id;
    const { text, title } = req.body;
    const todos = await Todos.read();
    const idx = todos.findIndex((el) => el.id == id);

    // when Unexpected id comes
    if (idx == -1) {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "No element with this id" }));
    }

    // when id is available
    else {
      const changedTodo = {
        id: todos[idx].id,
        text: text || todos[idx].text,
        title: title || todos[idx].title,
        date: new Date(),
        // isCompleted:
      };

      todos[idx] = changedTodo;
      res.writeHead(200);
      Todos.write([...todos]);

      res.end(JSON.stringify({ message: "ok" }));
    }
  }

  // Todo => Method DELETE
  if (req.url === "/" && req.method === "DELETE") {
    const todos = await Todos.read();
    req.body = await bodyParser(req);
    let id = req.body.id;
    const idx = todos.findIndex((el) => el.id == id);

    // When Unexpected id comes
    if (idx == -1) {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "No element with this id" }));
    }

    // When id is available
    else {
      todos.splice(idx, 1);
      Todos.write(todos);
      res.writeHead(200);
      res.end(JSON.stringify({ message: "Ok" }));
    }
  }

  // Todo => Get todo by id
  if (req.url === "/id" && req.method === "GET") {
    const todos = await Todos.read();
    req.body = await bodyParser(req);
    let id = req.body.id;
    const idx = todos.findIndex((el) => el.id == id);
    const founded = todos.find((el) => el.id == id);

    // When Unexpected id comes
    if (idx == -1) {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "No element with this id" }));
    }

    // When id is available
    else {
      res.writeHead(200);
      res.end(JSON.stringify(founded));
    }
  }

  // Todo => Iscompleted change

  if (req.url === "/id" && req.method === "PUT") {
    req.body = await bodyParser(req);
    let id = req.body.id;
    const { text, title,isCompleted } = req.body;
    const todos = await Todos.read();
    const idx = todos.findIndex((el) => el.id == id);

    // when Unexpected id comes
    if (idx == -1) {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "No element with this id" }));
    }

    // when id is available
    else {
      const changedTodo = {
        id: todos[idx].id,
        text: text || todos[idx].text,
        title: title || todos[idx].title,
        date: new Date(),
        isCompleted: isCompleted || todos[idx].isCompleted
      };

      todos[idx] = changedTodo;
      res.writeHead(200);
      Todos.write([...todos]);

      res.end(JSON.stringify({ message: "ok" }));
    }
  }
};

// Running Server
http.createServer(request).listen(2107);
