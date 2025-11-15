import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { Task, StatisticsProps } from "./types/Task"; // Import your types

ChartJS.register(ArcElement, Tooltip, Legend);

function groupCompleted(tasks: Task[]) {
  const completed = tasks.filter((t) => t.completed).length;
  const notCompleted = tasks.length - completed;
  return [completed, notCompleted];
}

function groupPriority(tasks: Task[]) {
  const priority = tasks.filter((t) => t.priority).length;
  const nonPriority = tasks.length - priority;
  return [priority, nonPriority];
}

function groupProductivity(tasks: Task[]) {
  const today = new Date();
  const onTime = tasks.filter((t) => {
    const due = new Date(t.due_date);
    return t.completed && due >= today;
  }).length;

  const total = tasks.length;
  const productivity = total === 0 ? 0 : (onTime / total) * 100;

  if (productivity >= 80) return [1, 0, 0]; // verde
  if (productivity >= 30) return [0, 1, 0]; // amarillo
  return [0, 0, 1]; // rojo
}

// 💡 NEW: Component now accepts 'tasks' via props
export default function Statistics({ tasks }: StatisticsProps) {
  const completedData = {
    labels: ["Completed", "Not Completed"],
    datasets: [
      {
        data: groupCompleted(tasks),
        backgroundColor: ["#00FDA4", "#F44336"], // verde neon y rojo
      },
    ],
  };

  const priorityData = {
    labels: ["Priority", "Non Priority"],
    datasets: [
      {
        data: groupPriority(tasks),
        backgroundColor: ["#F44336", "#FFCE56"], // rojo y amarillo
      },
    ],
  };

  const productivityData = {
    labels: ["High (>=80%)", "Medium (30–79%)", "Low (<30%)"],
    datasets: [
      {
        data: groupProductivity(tasks),
        backgroundColor: ["#00FDA4", "#FFCE56", "#F44336"], // verde neon, amarillo, rojo
      },
    ],
  };

  return (
    <div className="bg-[#000C19] flex flex-col items-center h-full">
      {/* Title */}
      <h1 className="text-5xl text-center text-[#00FDA4] mt-5 font-bold mb-8">
        Statistics
      </h1>

      {/* Charts container */}
      <div className="inline-flex gap-6 p-6 justify-center bg-[#CAEAFF] rounded-lg shadow-lg">
        <div className="flex flex-col items-center w-64">
          <h2 className="text-xl font-semibold text-[#000C19] mb-2">
            Completed Tasks
          </h2>
          <Doughnut data={completedData} />
        </div>

        <div className="flex flex-col items-center w-64">
          <h2 className="text-xl font-semibold text-[#000C19] mb-2">
            Priority Tasks
          </h2>
          <Doughnut data={priorityData} />
        </div>

        <div className="flex flex-col items-center w-64">
          <h2 className="text-xl font-semibold text-[#000C19] mb-2">
            Productivity
          </h2>
          <Doughnut data={productivityData} />
        </div>
      </div>
    </div>
  );
}
