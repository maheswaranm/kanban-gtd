import { Board } from '../classes/board';
import { Lane } from '../classes/lane';
import { Card } from '../classes/card';

const CardsDone: Card[] = [
    { id: 11, text: 'Card 11', position:1 },
    { id: 12, text: 'Card 12', position:1 },
    { id: 13, text: 'Card 13', position:1 },
    { id: 14, text: 'Card 14', position:1 },
    { id: 15, text: 'Card 15', position:1 },
    { id: 16, text: 'Card 16', position:1 },
    { id: 17, text: 'Card 17', position:1 },
    { id: 18, text: 'Card 18', position:1 },
    { id: 19, text: 'Card 19', position:1 },
    { id: 20, text: 'Card 20', position:1  }
  ];

const CardsDoing: Card[] = [
    { id: 21, text: 'Card 21', position:1 },
    { id: 22, text: 'Card 22', position:1 },
  ];

const CardsBacklog: Card[] = [
    { id: 31, text: 'Card 31', position:1 },
    { id: 32, text: 'Card 32', position:1 },
  ];

const BoardLanes: Lane[] = [
    { id: 11, name:'Backlog', cards:CardsBacklog},
    { id: 12, name:'Doing', cards:CardsDoing},
    { id: 13, name:'Done', cards:CardsDone},
];

export const MYBOARD: Board = {
    id: 1,
    name: 'My Board' ,
    lanes: BoardLanes
};

const EmptyLanes: Lane[] = [
    { id: 1, name:'Backlog', cards:[]},
    { id: 2, name:'Doing', cards:[]},
    { id: 3, name:'Done', cards:[]},
];

export const EMPTYBOARD: Board = {
    id: 1,
    name: 'Empty Board' ,
    lanes: EmptyLanes
};