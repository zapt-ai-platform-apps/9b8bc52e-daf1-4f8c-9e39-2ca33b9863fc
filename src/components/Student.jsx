import { createSignal, Show } from 'solid-js';
import { supabase } from '../supabaseClient';

function Student(props) {
  const [loading, setLoading] = createSignal(false);
  const [attendanceMarked, setAttendanceMarked] = createSignal(false);

  const markAttendance = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/markAttendance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        setAttendanceMarked(true);
      } else {
        console.error('Error marking attendance:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col items-center justify-center h-full">
      <h2 class="text-2xl font-bold mb-6 text-purple-600">Welcome, {props.user.email}</h2>
      <Show when={!attendanceMarked()}>
        <button
          class={`px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={markAttendance}
          disabled={loading()}
        >
          Mark Attendance
        </button>
      </Show>
      <Show when={attendanceMarked()}>
        <p class="text-lg font-semibold text-green-700">Attendance marked successfully!</p>
      </Show>
    </div>
  );
}

export default Student;