import Boundary from "./classes/Boundary.js";
import Ghost from "./classes/Ghost.js";
import Pellet from "./classes/Pellet.js";
import Player from "./classes/Player.js";

window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas");
  const c = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let score = 0;
  document.getElementById("score").innerHTML = "Score:" + " " + score;

  const map = [
    ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
    ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
    ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
    ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
    ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
    ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
  ];

  const createImage = (src) => {
    const image = new Image();
    image.src = src;
    return image;
  };

  let boundaries = [];
  let pellets = [];

  // Additional cases (does not include the power up pellet that's inserted later in the vid)
  map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case "-":
          boundaries.push(
            new Boundary({
              x: Boundary.width * j,
              y: Boundary.height * i,

              image: createImage("./img/pipeHorizontal.png"),
            })
          );
          break;
        case "|":
          boundaries.push(
            new Boundary({
              x: Boundary.width * j,
              y: Boundary.height * i,

              image: createImage("./img/pipeVertical.png"),
            })
          );
          break;
        case "1":
          boundaries.push(
            new Boundary({
              x: Boundary.width * j,
              y: Boundary.height * i,

              image: createImage("./img/pipeCorner1.png"),
            })
          );
          break;
        case "2":
          boundaries.push(
            new Boundary({
              x: Boundary.width * j,
              y: Boundary.height * i,

              image: createImage("./img/pipeCorner2.png"),
            })
          );
          break;
        case "3":
          boundaries.push(
            new Boundary({
              x: Boundary.width * j,
              y: Boundary.height * i,

              image: createImage("./img/pipeCorner3.png"),
            })
          );
          break;
        case "4":
          boundaries.push(
            new Boundary({
              x: Boundary.width * j,
              y: Boundary.height * i,

              image: createImage("./img/pipeCorner4.png"),
            })
          );
          break;
        case "b":
          boundaries.push(
            new Boundary({
              x: Boundary.width * j,
              y: Boundary.height * i,

              image: createImage("./img/block.png"),
            })
          );
          break;
        case "[":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              image: createImage("./img/capLeft.png"),
            })
          );
          break;
        case "]":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              image: createImage("./img/capRight.png"),
            })
          );
          break;
        case "_":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              image: createImage("./img/capBottom.png"),
            })
          );
          break;
        case "^":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              image: createImage("./img/capTop.png"),
            })
          );
          break;
        case "+":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              image: createImage("./img/pipeCross.png"),
            })
          );
          break;
        case "5":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              color: "blue",
              image: createImage("./img/pipeConnectorTop.png"),
            })
          );
          break;
        case "6":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              color: "blue",
              image: createImage("./img/pipeConnectorRight.png"),
            })
          );
          break;
        case "7":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              color: "blue",
              image: createImage("./img/pipeConnectorBottom.png"),
            })
          );
          break;
        case "8":
          boundaries.push(
            new Boundary({
              x: j * Boundary.width,
              y: i * Boundary.height,

              image: createImage("./img/pipeConnectorLeft.png"),
            })
          );
          break;
        case ".":
          pellets.push(
            new Pellet({
              x: j * Boundary.width + Boundary.width * 0.5,
              y: i * Boundary.height + Boundary.height * 0.5,
            })
          );
          break;
      }
    });
  });

  //handle key

  const keyBoards = {
    d: {
      press: false,
    },
    a: {
      press: false,
    },
    w: {
      press: false,
    },
    s: {
      press: false,
    },
  };

  const keys = Object.keys(keyBoards);

  let lastKey;
  window.addEventListener("keydown", ({ key }) => {
    if (keys.includes(key)) {
      keyBoards[key].press = true;
      lastKey = key;
    }
  });

  const checkArcCollisionWithRect = ({ arc, rect }) => {
    return (
      arc.y - arc.radius + arc.speedY <= rect.y + rect.height &&
      arc.y + arc.radius + arc.speedY >= rect.y &&
      arc.x - arc.radius + arc.speedX <= rect.x + rect.width &&
      arc.x + arc.radius + arc.speedX >= rect.x
    );
  };

  const checkArcCollisionWithArc = ({ arc1, arc2 }) => {
    const xDistance = arc1.x - arc2.x;
    const yDistance = arc1.y - arc2.y;

    const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

    return distance < arc1.radius + arc2.radius;
  };

  window.addEventListener("keyup", ({ key }) => {
    if (keys.includes(key)) keyBoards[key].press = false;
  });

  const player = new Player({
    x: Boundary.width,
    y: Boundary.height,
  });

  const ghosts = [
    new Ghost({
      x: Boundary.width * 6,
      y: Boundary.height,
      color: "red",
    }),
  ];

  const handleGhosts = () => {
    ghosts.forEach((ghost) => {
      ghost.update(c);
      const collisions = [];

      boundaries.forEach((boundary) => {
        if (
          !collisions.includes("up") &&
          checkArcCollisionWithRect({
            arc: {
              ...ghost,
              speedY: -5,
            },
            rect: boundary,
          })
        ) {
          collisions.push("up");
        }

        if (
          !collisions.includes("down") &&
          checkArcCollisionWithRect({
            arc: {
              ...ghost,
              speedY: 5,
            },
            rect: boundary,
          })
        ) {
          collisions.push("down");
        }

        if (
          !collisions.includes("right") &&
          checkArcCollisionWithRect({
            arc: {
              ...ghost,
              speedX: 5,
            },
            rect: boundary,
          })
        ) {
          collisions.push("right");
        }

        if (
          !collisions.includes("left") &&
          checkArcCollisionWithRect({
            arc: {
              ...ghost,
              speedX: -5,
            },
            rect: boundary,
          })
        ) {
          collisions.push("left");
        }
      });

      if (collisions.length > ghost.prevCollisions.length)
        ghost.prevCollisions = collisions;

      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
        const pathways = ghost.prevCollisions.filter(
          (collision) => !collisions.includes(collision)
        );
        console.log(pathways);
      }
    });
  };

  const animate = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);

    handleGhosts();

    pellets.forEach((pellet) => {
      pellet.update(c);

      if (
        checkArcCollisionWithArc({
          arc1: player,
          arc2: pellet,
        })
      ) {
        score += 10;
        document.getElementById("score").innerHTML = "Score:" + " " + score;
        pellet.markForDeletion = true;
      }
    });

    pellets = pellets.filter((pellet) => !pellet.markForDeletion);

    if (keyBoards.w.press && lastKey === "w") {
      for (let i = 0; i < boundaries.length; ++i) {
        if (
          checkArcCollisionWithRect({
            arc: {
              ...player,
              speedY: -5,
            },
            rect: boundaries[i],
          })
        ) {
          player.speedY = 0;
          break;
        } else player.speedY = -5;
      }
    } else if (keyBoards.s.press && lastKey === "s") {
      for (let i = 0; i < boundaries.length; ++i) {
        if (
          checkArcCollisionWithRect({
            arc: {
              ...player,
              speedY: 5,
            },
            rect: boundaries[i],
          })
        ) {
          player.speedY = 0;
          break;
        } else player.speedY = 5;
      }
    } else if (keyBoards.d.press && lastKey === "d") {
      for (let i = 0; i < boundaries.length; ++i) {
        if (
          checkArcCollisionWithRect({
            arc: {
              ...player,
              speedX: 5,
            },
            rect: boundaries[i],
          })
        ) {
          console.log("collision");
          player.speedX = 0;
          break;
        } else player.speedX = 5;
      }
    } else if (keyBoards.a.press && lastKey === "a") {
      for (let i = 0; i < boundaries.length; ++i) {
        if (
          checkArcCollisionWithRect({
            arc: {
              ...player,
              speedX: -5,
            },
            rect: boundaries[i],
          })
        ) {
          player.speedX = 0;
          break;
        } else player.speedX = -5;
      }
    }

    boundaries.forEach((boundary) => {
      boundary.update(c);

      if (
        checkArcCollisionWithRect({
          arc: player,
          rect: boundary,
        })
      ) {
        player.speedY = 0;
        player.speedX = 0;
      }
    });
    player.update(c);

    requestAnimationFrame(animate);
  };

  animate();
});
