import AverageMoodSleep from "./_components/average-mood-sleep";
import Greeting from "./_components/greeting";
import Header from "./_components/header";
import MoodSleepChart from "./_components/mood-sleep-chart";

function Home() {
  return (
    <main className="max-w-[1170px] pt-10 pb-20 w-full">
      <Header />

      <Greeting />

      <div className="grid grid-cols-[370px_1fr] gap-x-8 ">
        <AverageMoodSleep />
        <MoodSleepChart />
      </div>
    </main>
  );
}

export default Home;
