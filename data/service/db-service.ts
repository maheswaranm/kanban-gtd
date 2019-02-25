import "reflect-metadata";
import {getConnection, UpdateResult} from "typeorm";

import {createConnection} from "typeorm";
import { Board } from "../entity/board";
import { Lane } from "../entity/lane";
import { Card } from "../entity/card";

export class DBService {
	addCard(laneid: number, cardtext: string): Promise<void> {
		let connection = getConnection();

		async function addNewCard(): Promise<void> {
			try {
			    let laneRepo = connection.getRepository(Lane);
			    let cardRepo = connection.getRepository(Card);

			    let lane = await laneRepo.findOne(laneid);
			    let maxCardPos = await connection.createQueryBuilder()
			    							.select("MAX(card.position)","maxposition")
			    							.from(Card, "card")
			    							.where("card.lane = :laneid", {laneid : lane.id})
			    							.getRawOne();

			    if(maxCardPos == null) {
			    	maxCardPos.maxposition = 0
			    }


			    let newCard = new Card();
			    newCard.text = cardtext;
			    newCard.lane = lane;
			    newCard.position = maxCardPos.maxposition + 1;
			    newCard.create_time = new Date();

			    await cardRepo.save(newCard);

			}
			catch(err) {
				console.log(err)
			}

		}

		return addNewCard();
	}

	updateCard(cardid: number, cardtext:string) {
		let connection = getConnection();

		async function updateCard(): Promise<void> {
			try {
				let cardRepo = connection.getRepository(Card);

				let cardToUpdate = await cardRepo.findOne(cardid);
				cardToUpdate.text = cardtext;

				await cardRepo.save(cardToUpdate);
			}
			catch(err) {
				console.log(err);
			}
		}

		updateCard();

	}

	getBoard(boardid: number): Promise<Board> {
		let connection = getConnection();
		let allboarddata = {} ;

		async function getBoardData(boardid: number): Promise<Board> {
			try {
				let boardRepo = connection.getRepository(Board);

				let boarddata = await boardRepo.findOne({ where : { id : boardid }, relations: ["lanes", "lanes.cards"] })

				return boarddata;

			}
			catch(err) {
				console.log(err);
				return null;
			}

		}

		return getBoardData(boardid);

	}

	updateBoard(fromLaneId, oldPos, toLaneId, newPos): Promise<Card> {
		let connection = getConnection();

		let boardRepo = connection.getRepository(Board);
		let cardRepo = connection.getRepository(Card);
		let laneRepo = connection.getRepository(Lane);

		async function updateBoard():Promise<UpdateResult> {
			try {

				let cardtoupdate = await cardRepo.findOne({position:oldPos, lane:fromLaneId});
				cardtoupdate.position = -1;
				await cardRepo.save(cardtoupdate);

				let updateresult

				if(fromLaneId == toLaneId) {
					if(newPos < oldPos) {
					updateresult = await connection.createQueryBuilder()
								.update(Card)
								.set({position: () => "position + 1"  })
								.where('laneid = :fromLane and position >= :newIndex and position < :oldIndex'
									, { fromLane:fromLaneId, oldIndex: oldPos, newIndex: newPos})
								.execute();

					}
					else {

					updateresult = await connection.createQueryBuilder()
								.update(Card)
								.set({position: () => "position - 1"  })
								.where('laneid = :fromLane and position <= :newIndex and position > :oldIndex'
									, { fromLane:fromLaneId, oldIndex: oldPos, newIndex: newPos})
								.execute();

					}					
				}
				else {

					let updateSource = await connection.createQueryBuilder()
											.update(Card)
											.set({position: () => "position - 1"  })
											.where('laneid = :fromLane and position >= :oldIndex'
													, { fromLane:fromLaneId, oldIndex: oldPos})
											.execute();

					updateresult = await connection.createQueryBuilder()
											.update(Card)
											.set({position: () => "position + 1"  })
											.where('laneid = :toLane and position >= :newIndex'
													, { toLane:toLaneId, newIndex: newPos})
											.execute();


				}


				return updateresult;

			}
			catch(err) {
				console.log(err);
			}
		}

		async function updateCard():Promise<Card> {
			let cardtoupdate = await cardRepo.findOne({position:-1, lane:fromLaneId});
			cardtoupdate.position = newPos;	
			if(fromLaneId != toLaneId) {
				cardtoupdate.lane = await laneRepo.findOne(toLaneId);
			}

			let result = await cardRepo.save(cardtoupdate);

			return result
		}


		return updateBoard().then(
			() => {
				return updateCard();
			}
			);

	}


	addBoard(boardname:string, lanenames:string[]):Promise<Board> {
		let connection = getConnection();

		let boardRepo = connection.getRepository(Board);
		let laneRepo = connection.getRepository(Lane);

		async function addBoard() {
			let newboard = new Board();
			newboard.name = boardname;

			for(let lane in lanenames) {
				let newlane = new Lane();
				newlane.board = newboard;
				newlane.name = lanenames[lane];

				await laneRepo.save(newlane);
			}

			return await boardRepo.save(newboard);

		}

		return addBoard();


	}

}
