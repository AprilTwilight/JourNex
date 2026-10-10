
import './Startseite.css'

type Achievement = {
     label: string;
     title: string;
     progress: string;
     color: "blue" | "orange" | "red";
 };

 const achievements: Achievement[] = [
     {
         label: "RANKED",
         title: "Diamond Division",
         progress: "2.300 / 3.000",
         color: "blue",
     },
     {
         label: "SEASON",
         title: "Champion",
         progress: "25 / 50",
         color: "orange",
     },
     {
         label: "EVENT",
         title: "Master Challenger",
         progress: "75 / 100",
         color: "red",
     },
 ];

 const ranking = [
     { position: 1, name: "Nova", score: 5320 },
     { position: 2, name: "Storm", score: 4980 },
     { position: 3, name: "Kira", score: 4650 },
     { position: 4, name: "Shadow", score: 4310 },
     { position: 5, name: "Viper", score: 4120 },
 ];
 
 
function Startseite() {

        return (
            <div className="dashboard">

                {/* HEADER */}

                <header className="topbar">
                    <div className="logo">
                        JOURNE<span>X</span>
                    </div>

                    <nav>
                        <a className="active" href="#">HOME</a>
                        <a href="#">TEAMS</a>
                        <a href="#">EVENTS</a>
                        <a href="#">STATISTICS</a>
                        <a href="#">NEWS</a>
                        <a href="#">COMMUNITY</a>
                    </nav>

                    <div className="userArea">
                        <button className="searchButton">⌕</button>

                        <div className="profile">
                            <div className="avatar">K</div>

                            <div>
                                <strong>Katharina</strong>
                                <span>ONLINE</span>
                            </div>
                        </div>
                    </div>
                </header>


                {/* MAIN */}

                <main className="content">

                    <section className="topGrid">

                        {/* HERO */}

                        <article className="heroCard">

                            <div className="heroOverlay"></div>

                            <div className="heroContent">
                                <span className="eyebrow">
                                    SEASON 03
                                </span>

                                <h1>
                                    JOURNEX
                                    <br />
                                    MASTERS
                                    <br />
                                    SEASON 3
                                </h1>

                                <p>
                                    550.000 PRIZE POOL
                                </p>

                                <button>
                                    VIEW EVENT
                                </button>
                            </div>

                            <div className="heroTimer">
                                <span>STARTS IN</span>

                                <strong>
                                    01 : 12 : 47 : 33
                                </strong>

                                <small>
                                    DAYS &nbsp;&nbsp; HOURS &nbsp;&nbsp;
                                    MIN &nbsp;&nbsp; SEC
                                </small>
                            </div>

                        </article>


                        {/* LIVE MATCH */}

                        <article className="panel liveMatch">

                            <div className="panelHeading">
                                <span>LIVE MATCH</span>
                                <span className="live">
                                    ● LIVE
                                </span>
                            </div>

                            <div className="matchInfo">
                                <span>
                                    JourNex Masters
                                </span>

                                <strong>
                                    G2 Esports
                                </strong>

                                <div className="score">
                                    14 : 11
                                </div>

                                <span>
                                    Team Liquid
                                </span>
                            </div>

                            <button className="orangeOutline">
                                ▶ STREAM ANSEHEN
                            </button>

                        </article>

                    </section>


                    {/* ACHIEVEMENTS */}

                    <section className="section">

                        <div className="sectionTitle">
                            <h2>
                                STANDORTION-MOMENTS
                            </h2>

                            <button>
                                ALLE ANZEIGEN
                            </button>
                        </div>

                        <div className="achievementGrid">

                            {achievements.map((achievement) => (
                                <article
                                    className={`achievement ${achievement.color}`}
                                    key={achievement.title}
                                >

                                    <span>
                                        {achievement.label}
                                    </span>

                                    <div className="achievementIcon">
                                        ◈
                                    </div>

                                    <h3>
                                        {achievement.title}
                                    </h3>

                                    <p>
                                        {achievement.progress}
                                    </p>

                                    <button>
                                        VIEW
                                    </button>

                                </article>
                            ))}

                        </div>
                    </section>


                    {/* LOWER AREA */}

                    <section className="bottomGrid">

                        {/* YOUR PROGRESS */}

                        <article className="panel progressPanel">

                            <div className="panelHeading">
                                <h2>
                                    DEIN FORTSCHRITT
                                </h2>
                            </div>

                            <div className="progressContent">

                                <div className="rankBadge">
                                    ◈
                                </div>

                                <div className="progressStats">

                                    <strong>
                                        1.82
                                    </strong>

                                    <span>
                                        CURRENT RATING
                                    </span>

                                    <div className="progressBar">
                                        <div></div>
                                    </div>

                                </div>

                                <div className="versus">
                                    <div>
                                        <strong>VS</strong>
                                        <span>RANKED</span>
                                    </div>

                                    <button>
                                        MATCH FINDEN
                                    </button>
                                </div>

                            </div>

                        </article>


                        {/* LEADERBOARD */}

                        <article className="panel leaderboard">

                            <div className="panelHeading">
                                <h2>SCOREBOARD</h2>

                                <span>
                                    TOP 5
                                </span>
                            </div>

                            <div className="ranking">

                                {ranking.map((player) => (
                                    <div
                                        className="rankingRow"
                                        key={player.position}
                                    >

                                        <span className="position">
                                            {player.position}
                                        </span>

                                        <span className="rankingAvatar">
                                            {player.name.charAt(0)}
                                        </span>

                                        <strong>
                                            {player.name}
                                        </strong>

                                        <span className="rankingScore">
                                            {player.score}
                                        </span>

                                    </div>
                                ))}

                            </div>

                        </article>


                        {/* TEAM */}

                        <article className="panel teamSpotlight">

                            <div className="panelHeading">
                                <h2>TEAM SPOTLIGHT</h2>
                            </div>

                            <div className="teamMembers">

                                <div className="member">J</div>
                                <div className="member">N</div>
                                <div className="member">X</div>
                                <div className="member">S</div>

                            </div>

                            <h3>
                                G2 ESPORTS
                            </h3>

                            <p>
                                #2 GLOBAL RANKING
                            </p>

                            <button className="orangeOutline">
                                TEAM ANSEHEN
                            </button>

                        </article>


                        {/* COMMUNITY */}

                        <article className="panel community">

                            <span>
                                JOIN THE COMMUNITY
                            </span>

                            <h2>
                                BLEIB MIT DEINEM
                                <br />
                                TEAM VERBUNDEN
                            </h2>

                            <p>
                                Tausche dich mit anderen Spielern aus
                                und finde neue Mitspieler.
                            </p>

                            <button onClick={() => window.location.href = "https://discord.com/invite/journex-esport-hosting"}>
                                DISCORD BEITRETEN
                            </button>

                        </article>

                    </section>

                </main>

            </div>
        )
    }

export default Startseite