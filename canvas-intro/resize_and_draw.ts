const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

c.fillRect(100, 400, 100, 100);
c.fillStyle = "#afbfaf";
c.fillRect(300, 400, 100, 100);
c.fillStyle = "darkBlue";
c.fillRect(500, 400, 100, 100);

c.beginPath();
c.moveTo(10, 450);
c.lineTo(170, 300);
c.lineTo(330, 630);
c.lineTo(550, 300);
c.lineTo(650, 450);
c.strokeStyle = "cyan";
c.stroke();

c.beginPath();

c.arc(100, 100, 50, 0, 2 * Math.PI, false);
c.strokeStyle = "white";
c.stroke();

for (let index = 0; index < Math.random() * 20; index++) {
  c.beginPath();

  c.strokeStyle = Math.random() >= 0.5 ? "red" : "blue";
  c.arc(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    Math.random() * 100,
    0,
    2 * Math.PI,
    false,
  );
  c.stroke();
}
