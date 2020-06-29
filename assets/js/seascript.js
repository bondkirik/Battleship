const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');    // Get first header html

// Contains ships and methods for adding ships to a page.

const game = {
    ships: [],          // ships obj array
    shipCount: 0,
    optionShip: {
        count: [1, 2, 3, 4],           // count ships and size ships...
        size: [4, 3, 2, 1]
    },
    collision: new Set(),
    generateShip() {                  // generate ship
        for (let i = 0; i < this.optionShip.count.length; i++) {
            for (let j = 0; j < this.optionShip.count[i]; j++) {
                const size = this.optionShip.size[i];
                const ship = this.generateOptionsShip(size);
                this.ships.push(ship);
                this.shipCount++;
            }
        }
    },
    generateOptionsShip(shipSize) {
        const ship = {
            hit: [],
            location: [],
        };

        const direction = Math.random() < 0.5;   // Math.random get random number from 0 to 0.999999. compare 0.5 divide Math.random on 0 - 0.499999(true) and 0.5 - 0.999999(false)

        let x, y;

        if (direction) {
            x = Math.floor(Math.random() * 10);
            y = Math.floor( Math.random() * (10 - shipSize) );
        } else {
            x = Math.floor( Math.random() * (10 - shipSize) );
            y = Math.floor(Math.random() * 10);
        }

        for (let i = 0; i < shipSize; i++) {
            if (direction) {
                ship.location.push( x + '' + (y + i) );
            } else {
                ship.location.push( (x + i) + '' + y );
            }
            ship.hit.push('');
        }

        if ( this.checkCollision(ship.location) ) {
            return this.generateOptionsShip(shipSize);
        }

        this.addCollision(ship.location);

        return ship;
    },
    checkCollision(location) {
        for (const coord of location) {
            if ( this.collision.has(coord) ) {
                return true;
            }
        }
    },
    addCollision(location) {
        for (let i = 0; i < location.length; i++) {
            const startCoordX = location[i][0] - 1;

            for (let j = startCoordX; j < startCoordX + 3; j++) {
                const startCoordY = location[i][1] - 1;

                for (let z = startCoordY; z < startCoordY + 3; z++) {

                    if (j >= 0 && j < 10 && z >= 0 && z < 10) {
                        const coord = j + '' + z;
                        this.collision.add(coord);
                    }

                }
            }
        }
    },
};


// Create object for data on span

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0,
    shot: 0,
    hit: 0,
    dead: 0,
    set updateData(data) {                 // get all data.
        this[data] += 1;				   // add +1.
        this.render(); 					   // call method render.
    },
    render() {                             // To display changes in numbers in spans when clicking on cells.
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
        record.textContent = this.record;
    }
};


// An object with methods that reflect a change in a cell when clicked.

const show = {
    hit(elem) {
        this.changeClass(elem, 'hit');
    },
    miss(elem) {                             //  get target. elem - id.
        this.changeClass(elem, 'miss');      // this(show). turn to the method changeClass.
    },
    dead(elem) {
        this.changeClass(elem, 'dead');
    },
    changeClass(elem, value) {             	// change class elem. get elem and class for which change - value.
        elem.className = value;				// className - the property that each element has. Contains a list of classes that an element has.
    }
};

// on event click, an object of this event is created 'event'.
// This object has a property target (shows which cell is made click).
// Write cell data to a variable target.

const fire = (event) => {
    const target = event.target;
    if (target.classList.length != 0 ||		// (16) length - count classes in elem.
        target.tagName !== 'TD' ||
        !game.shipCount) return;
    // if length != 0, return
    // (17) if click passes tag td, bug check
    show.miss(target);              // The first call miss. pass on miss - target.
    play.updateData = 'shot';       // (15) call the object play and date set to shot.

    for (let i = 0; i < game.ships.length; i++) {
        const ship = game.ships[i];
        const index = ship.location.indexOf(target.id);
        if (index >= 0) {
            show.hit(target);
            play.updateData = 'hit';
            ship.hit[index] = 'x';
            const life = ship.hit.indexOf('');
            if (life < 0) {
                play.updateData = 'dead';
                for (const id of ship.location) {
                    show.dead( document.getElementById(id) );
                }

                game.shipCount -= 1;

                if (!game.shipCount) {
                    header.textContent = 'Игра окончена!';  //One win change header
                    header.style.color = 'red';

                    if (play.shot < play.record || play.record === 0) {
                        localStorage.setItem('seaBattleRecord', play.shot);
                        play.record = play.shot;
                        play.render();
                    }

                }
            }
        }
    }
};

// call function fire

const init = () => {
    enemy.addEventListener('click', fire);
    play.render();
    game.generateShip();                           // Generate ships
    again.addEventListener('click', () => {
        location.reload();
    });

    record.addEventListener('dblclick', () => {
        localStorage.clear();                            // clear date after record
        play.record = 0;
        play.render();
    });

};

init();