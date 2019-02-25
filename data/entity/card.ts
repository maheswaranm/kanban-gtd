import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";

import { Lane } from './lane' 

@Entity()
export class Card {

	@PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    position: number;

    @ManyToOne(type => Lane, lane => lane.cards, { 
    	cascade: true
    })
    lane: Lane;

    @Column()
    create_time: Date;

    @Column()
    update_time: Date;
  }