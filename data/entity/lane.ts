import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

import { Card } from './card';
import { Board } from './board';

@Entity()
export class Lane {

	@PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Card, card => card.lane)
    cards: Card[];

    @ManyToOne(type => Board, board => board.lanes, { 
    	cascade: true
    })
    board: Board;

  }