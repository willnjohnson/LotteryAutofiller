// ==UserScript==
// @name         Neopets Lottery Autofiller
// @namespace    GreaseMonkey
// @version      1.0
// @author       @willnjohnson
// @description  Auto-fill lottery ticket with optimal number distribution
// @match        *://www.neopets.com/games/lottery.phtml*
// @grant        none
// ==/UserScript==

/*
Short Explanation of Ticket Selection (and why we don't just select purely random numbers or choose certain repeated patterns):
- Avoid overlapping number combinations across the 20 daily tickets
- The goal is to maximize the total number of distinct matches (especially 4 or 5 correct numbers)
- It shows that if you use repeated numbers (like always picking 1, 2, 3, 4, 5), your tickets "step on each other’s toes" — multiple tickets win the same prize instead of covering more distinct outcomes
- It estimates your real-world expected win frequency from diversified vs redundant tickets
- It acknowledges that perfect optimization is hard, but approximate shuffling helps
*/
(function () {
  const STORAGE_KEY = 'neopets_lottery_stack';
  const NUM_TICKETS = 20;
  const NUMBERS_PER_TICKET = 6;
  const MAX_NUMBER = 30;

  function loadTicketStack() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  function saveTicketStack(stack) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
  }

  function generateTicket(exclude = []) {
    const ticket = [];
    const excludedSet = new Set(exclude.flat());

    while (ticket.length < NUMBERS_PER_TICKET) {
      const n = Math.floor(Math.random() * MAX_NUMBER) + 1;
      if (!ticket.includes(n) && !excludedSet.has(n)) {
        ticket.push(n);
      }
    }

    return ticket.sort((a, b) => a - b);
  }

  function generateTickets() {
    const allTickets = [];
    for (let i = 0; i < NUM_TICKETS; i++) {
      let bestTicket = null;
      let bestScore = Infinity;

      for (let j = 0; j < 100; j++) {
        const candidate = generateTicket();
        const overlap = allTickets.reduce((sum, existing) => {
          return sum + candidate.filter(x => existing.includes(x)).length;
        }, 0);

        if (overlap < bestScore) {
          bestScore = overlap;
          bestTicket = candidate;
          if (overlap === 0) break;
        }
      }

      allTickets.push(bestTicket);
    }
    return allTickets;
  }

  function populateInputs(ticket) {
    const fields = ['one', 'two', 'three', 'four', 'five', 'six'];
    for (let i = 0; i < fields.length; i++) {
      const input = document.querySelector(`input[name="${fields[i]}"]`);
      if (input) input.value = ticket[i];
    }
  }

  function interceptSubmit(stack) {
    const form = document.querySelector('form[action="process_lottery.phtml"]');
    if (!form) return;

    form.addEventListener('submit', () => {
      stack.pop(); // remove the top ticket
      saveTicketStack(stack);
    });
  }

  function addResetButton() {
    const submitButton = document.querySelector('input[type="submit"][value="Buy a Lottery Ticket!"]');
    if (!submitButton) return;
    
    const contentTd = document.querySelector('td.content');
    
    if (contentTd) {
        // Ensure contentTd is position: relative for absolute positioning of button
        if (getComputedStyle(contentTd).position === 'static') {
            contentTd.style.position = 'relative';
        }
      
        // Line break so button isn't covered
        document.querySelector('td.content td:nth-of-type(2)').innerHTML = '<br><br><br>' + document.querySelector('td.content td:nth-of-type(2)').innerHTML;

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Clear Lottery Stack from LocalStorage';
        Object.assign(resetBtn.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#007FFF', // Azure blue
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
            userSelect: 'none',
        });
      
        resetBtn.addEventListener('mouseenter', () => Object.assign(resetBtn.style, { backgroundColor: '#003FBF' }));

        resetBtn.addEventListener('mouseleave', () => Object.assign(resetBtn.style, { backgroundColor: '#007FFF' }));
      
      	resetBtn.addEventListener('click', (e) => {
          e.preventDefault();
          saveTicketStack([]); // Set to empty array
          (() => {
            const modal = document.createElement('div');
            modal.style = `
              position:fixed;top:0;left:0;width:100%;height:100%;
              background:rgba(0,0,0,0.4);display:flex;
              align-items:center;justify-content:center;
              z-index:9999;
            `;

            const box = document.createElement('div');
            box.style = `
              background:#007FFF;color:white;padding:20px 30px;
              border-radius:10px;font-family:sans-serif;
              font-size:16px;max-width:400px;text-align:center;
              position:relative;box-shadow:0 4px 12px rgba(0,0,0,0.3);
            `;
            box.innerHTML = `
              <div style="font-size:18px;font-weight:bold;margin-bottom:10px;">Lottery Stack Cleared</div>
              <hr style="border:0;height:1px;background:white;margin:0 0 15px;">
              <div>Please reload the page to generate a new batch of tickets.</div>
              <div style="position:absolute;top:6px;right:12px;cursor:pointer;font-weight:bold;font-size:18px;" id="closeBtn">&times;</div>
            `;

            modal.appendChild(box);
            document.body.appendChild(modal);
            
            document.getElementById('closeBtn').onclick = () => {
              modal.style.background = 'transparent';
              modal.remove();
            };
          })();
        });

        contentTd.appendChild(resetBtn);
    }
  }

  // Main logic
  const ticketStack = loadTicketStack();

  if (ticketStack.length === 0) {
    const newTickets = generateTickets();
    saveTicketStack(newTickets);
    populateInputs(newTickets[newTickets.length - 1]);
    interceptSubmit(newTickets);
  } else {
    populateInputs(ticketStack[ticketStack.length - 1]);
    interceptSubmit(ticketStack);
  }

  addResetButton();
})();
