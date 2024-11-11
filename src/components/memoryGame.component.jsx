import { useEffect, useState } from "react";

import UnoLogo from "../assets/uno-logo.png";

import "./memoryGame.component.css";
import { unoCardsContent } from "../constants/unoCards.constant";
import WinningModal from "./winningModal";

const MemoryGame = () => {
  const [showModal, setShowModal] = useState(false);
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [won, setWon] = useState(false);
  const onRestartGame = () => {
    setShowModal(false);
    initializeGame();
  };
  const initializeGame = () => {
    const totalCards = unoCardsContent?.length * 2;
    // const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    setGridSize(7);
    const shuffleCards = [
      ...unoCardsContent?.map((card) => card.content),
      ...unoCardsContent?.map((card) => card.content),
    ]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, content: number }));
    console.log("shuffle", shuffleCards);

    setCards(shuffleCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    console.log("secondId", secondId, firstId, solved, cards);

    const [firstContent, secondContent] = [
      cards[firstId].content,
      cards[secondId].content,
    ];
    if (firstContent === secondContent) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
    // console.log("secondId", secondId, firstId, solved);
  };

  const handleCardClick = (id) => {
    if (disabled || won) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setDisabled(false);
        setFlipped([]);
      }
    }
  };

  const isCardFlipped = (id) => {
    return flipped?.includes(id) || solved?.includes(id);
  };

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
      setShowModal(true);
    }
  }, [solved, cards]);
  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  return (
    <>
      {showModal && (
        <>
          <WinningModal onRestartGame={onRestartGame} />
        </>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h1 className="text-3xl font-bold mb-6">UNO&apos;s Memory Game</h1>

        <button
          className="mt-4 px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => initializeGame()}
        >
          {won ? "Play Again" : "Reset"}
        </button>
        <div
          className={`grid gap-12 mb-4`}
          style={{
            gridTemplateColumns: `repeat(${gridSize},minmax(0,1fr))`,
            width: `min(100%, ${gridSize * 16.5}rem)`,
          }}
        >
          {cards?.map((card) => {
            return (
              <div
                className={`card  text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                  isCardFlipped(card?.id)
                    ? solved?.includes(card?.id)
                      ? "bg-green-500 text-white"
                      : "bg-white text-black"
                    : " bg-gray-900 text-gray-400"
                } `}
                key={card?.id}
                onClick={() => handleCardClick(card?.id)}
              >
                {isCardFlipped(card?.id) ? (
                  <div
                    className={`card ${
                      card?.content === "plus_four" || card?.content === "wild"
                        ? "black"
                        : "yellow"
                    } `}
                  >
                    <div className="ellipse"></div>

                    {card?.content === "skip" ? (
                      <>
                        <div className="content yellow">
                          <div className="skip"></div>
                        </div>
                        <div className="small-content">
                          <div className="skip"></div>
                        </div>
                        <div className="small-content-reverse">
                          <div className="skip"></div>
                        </div>
                      </>
                    ) : card?.content === "plus_four" ? (
                      <>
                        <div className="content black">
                          <div className="plus-four">
                            <div className="card1"></div>
                            <div className="card2"></div>
                            <div className="card3"></div>
                            <div className="card4"></div>
                          </div>
                        </div>
                        <div className="small-content black">+4</div>
                        <div className="small-content-reverse black">+4</div>
                      </>
                    ) : card?.content === "wild" ? (
                      <>
                        <div className="content black">
                          <div className="wild">
                            <div className="segment yellow"></div>
                            <div className="segment green"></div>
                            <div className="segment blue"></div>
                            <div className="segment red"></div>
                          </div>
                        </div>
                        <div className="small-content black">
                          {" "}
                          <div className="wild">
                            <div className="segment yellow"></div>
                            <div className="segment green"></div>
                            <div className="segment blue"></div>
                            <div className="segment red"></div>
                          </div>
                        </div>
                        <div className="small-content-reverse black">
                          <div className="wild">
                            <div className="segment yellow"></div>
                            <div className="segment green"></div>
                            <div className="segment blue"></div>
                            <div className="segment red"></div>
                          </div>
                        </div>
                      </>
                    ) : card?.content === "reverse" ? (
                      <>
                        <div className="content yellow">
                          <div className="reverse">
                            <div className="arrows">
                              <div className="arrow"></div>
                              <div className="arrow"></div>
                            </div>
                          </div>
                        </div>
                        <div className="small-content">
                          <div className="reverse">
                            <div className="arrows">
                              <div className="arrow"></div>
                              <div className="arrow"></div>
                            </div>
                          </div>
                        </div>
                        <div className="small-content-reverse">
                          <div className="reverse">
                            <div className="arrows">
                              <div className="arrow"></div>
                              <div className="arrow"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="content yellow">
                          {card?.content === "plus_two" ? (
                            <div className="plus-two"></div>
                          ) : (
                            card?.content
                          )}
                        </div>
                        <div className="small-content">
                          {card?.content === "plus_two" ? "+2" : card?.content}
                        </div>
                        <div className="small-content-reverse">
                          {card?.content === "plus_two" ? "+2" : card?.content}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ position: "absolute", top: "16%", left: "6%" }}>
                    <img
                      style={{ textAlign: "center" }}
                      width={230}
                      src={UnoLogo}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MemoryGame;
