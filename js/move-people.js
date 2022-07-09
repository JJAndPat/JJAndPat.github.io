let mickey;
let princess;
let proposal;
let step = 0;
function movePeople() {
  mickey = document.getElementById('mickey');
  princess = document.getElementById('princess');
  proposal = document.getElementById('proposal');
  window.setTimeout(move, 16);
}

function move() {
  mickey.style.marginLeft = step / 2 + 'vw';
  princess.style.marginRight = step / 2 + 'vw';
  step++;

  if (step < 1000 / 16) {
    window.setTimeout(move, 16);
  } else {
    const minSize = Math.min(window.ScreenHeight, window.ScreenWidth) * 0.5;
    proposal.style.height = minSize + 'px';
    proposal.style.width = minSize + 'px';
    proposal.style.display = 'block';
    mickey.style.display = 'none';
    princess.style.display = 'none';
  }
}

window.movePeople = movePeople;