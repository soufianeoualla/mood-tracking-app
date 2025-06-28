import AverageMoodSleep from "./_components/average-mood-sleep";
import Greeting from "./_components/greeting";
import Header from "./_components/header";
import MoodSleepChart from "./_components/mood-sleep-chart";
import { MoodProvider } from "./_context/use-mood";

function Home() {
  return (
    <MoodProvider>
      <main className="max-w-[1170px] pt-10 pb-20 w-full px-4 xl:px-0">
        <Header />

        <Greeting />

        <div className="grid xl:grid-cols-[370px_1fr] gap-8 ">
          <AverageMoodSleep />
          <MoodSleepChart />
        </div>
      </main>
    </MoodProvider>
  );
}

export default Home;
