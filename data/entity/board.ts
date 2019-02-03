import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

import { Lane } from './lane';

@Entity()
export class Board {
	@PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Lane, lane => lane.board)
    lanes: Lane[];
  }