import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Student from './components/Student';
import Teacher from './components/Teacher';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [userRole, setUserRole] = createSignal(null);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('loading');
      fetchUserRole(user);
    }
  };

  const fetchUserRole = async (user) => {
    setLoading(true);
    try {
      const response = await fetch('/api/getUserRole', {
        headers: {
          'Authorization': `Bearer ${user.access_token || (await supabase.auth.getSession()).data.session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.role);
        setCurrentPage('home');
      } else if (response.status === 404) {
        // User not found in database, prompt to select role
        setCurrentPage('selectRole');
      } else {
        console.error('Error fetching user role:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('loading');
        fetchUserRole(session.user);
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const saveUserRole = async (role) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/saveUserRole', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      if (response.ok) {
        setUserRole(role);
        setCurrentPage('home');
      } else {
        console.error('Error saving user role:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving user role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <Show when={currentPage() === 'login'}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
            <a
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline mb-6 block text-center"
            >
              Learn more about ZAPT
            </a>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'facebook', 'apple']}
              magicLink={true}
              view="magic_link"
              showLinks={false}
              authView="magic_link"
            />
          </div>
        </div>
      </Show>

      <Show when={currentPage() === 'selectRole'}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
            <h2 class="text-2xl font-bold mb-6 text-center text-purple-600">Select Your Role</h2>
            <button
              class="w-full px-6 py-3 mb-4 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
              onClick={() => saveUserRole('student')}
              disabled={loading()}
            >
              I'm a Student
            </button>
            <button
              class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
              onClick={() => saveUserRole('teacher')}
              disabled={loading()}
            >
              I'm a Teacher
            </button>
          </div>
        </div>
      </Show>

      <Show when={currentPage() === 'home'}>
        <div class="h-full">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600">Attendance App</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
          <Show when={userRole() === 'student'}>
            <Student user={user()} />
          </Show>
          <Show when={userRole() === 'teacher'}>
            <Teacher user={user()} />
          </Show>
        </div>
      </Show>
      
      <Show when={currentPage() === 'loading'}>
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <span class="text-xl font-semibold text-purple-600">Loading...</span>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;