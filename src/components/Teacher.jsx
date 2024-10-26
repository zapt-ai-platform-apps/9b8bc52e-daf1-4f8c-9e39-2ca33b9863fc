import { createSignal, onMount, For } from 'solid-js';
import { supabase } from '../supabaseClient';

function Teacher(props) {
  const [loading, setLoading] = createSignal(false);
  const [attendanceList, setAttendanceList] = createSignal([]);

  const fetchAttendanceList = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getAttendanceList', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAttendanceList(data);
      } else {
        console.error('Error fetching attendance list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching attendance list:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchAttendanceList);

  return (
    <div>
      <h2 class="text-2xl font-bold mb-4 text-purple-600">Attendance List</h2>
      <button
        class={`px-6 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={fetchAttendanceList}
        disabled={loading()}
      >
        Refresh
      </button>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th class="py-2 px-4 bg-purple-500 text-white">Student Email</th>
              <th class="py-2 px-4 bg-purple-500 text-white">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <For each={attendanceList()}>
              {(record) => (
                <tr>
                  <td class="border-t px-4 py-2">{record.email}</td>
                  <td class="border-t px-4 py-2">{new Date(record.timestamp).toLocaleString()}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teacher;