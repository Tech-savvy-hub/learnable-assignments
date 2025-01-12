const fs = require('fs');
/* const { command } = require("commander"); */
const { program } = require("commander");

const BLOG_FILE = "posts.json";

if (!fs.existsSync(BLOG_FILE)) {
  fs.writeFileSync(BLOG_FILE, JSON.sringify([]));
}

function loadPosts() {
  const data = fs.readFileSync(BLOG_FILE, "utf8");
  return JSON.parse(data);
}

function savePosts(posts) {
  fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2));
}
/* add a blog post */

function addPost(title, content) {
  const posts = loadPosts();
  const id = posts.length + 1;
  posts.push({ id, title, content });
  savePosts(posts);
  console.log(`post '${title}' added successfully!`);
}

/* view all posts */

function viewPosts() {
  const posts = loadPosts();
  if (posts.length === 0) {
    console.log("sorry,No posts found.");
    return;
  }
  posts.forEach((post) => {
    console.log(
      `ID: ${post.id} | Title: ${post.title}\ncontent:                ${post.content}\n`,
    );
  });
}

//view a single post

function viewPost(id) {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    console.log(
      `ID: ${post.id} | Title: ${post.title} \ncontent:               ${post.content}`,
    );
  } else {
    console.log(`post with ID ${id} not found`);
  }
}

//update a blog post
function updatePost(id, title, content) {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.title = title || post.title;
    post.content = content || post.content;
    savePosts(posts);
    console.log(`post with ID ${id} updated succesfully`);
  } else {
    console.log(`post with ID ${id} not found`);
  }
}

//delete a post

function deletePost(id) {
  let posts = loadPosts();
  const initialLength = posts.length;
  posts = posts.filter((p) => p.id !== id);
  if (posts.length < initialLength) {
    savePosts(posts);
    console.log(`post with ID ${id} deleted succefully`);
  } else {
    console.log(`post with ID ${id} not found`);
  }
}

//CLI commands

program
  .command("add <title> <content>")
  .description("Add a new blog post")
  .action(addPost);

program.command("view").description("view all blog posts").action(viewPosts);

program
  .command("viewOne <id>")
  .description("view a single blog post by ID ")
  .action((id) => viewPost(Number(id)));

program
  .command("update <id> [title] [content]")
  .action((id, title, content) => updatePost(Number(id), title, content));

program
  .command("delete <id>")
  .description("delete a blog post by ID")
  .action((id) => deletePost(Number(id)));

program.parse(process.argv);
