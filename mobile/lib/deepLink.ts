import { supabase } from './supabase';
import * as Linking from 'expo-linking';

const WEB_APP_URL = 'https://reps-elchic00-elchic00s-projects.vercel.app';

/**
 * Opens a web URL with authentication tokens to maintain logged-in state
 * @param path - The path to open (e.g., '/challenge/123')
 * @returns Promise<void>
 */
export async function openWebWithAuth(path: string): Promise<void> {
  try {
    // Get current session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      console.error('No active session found');
      // Fallback: Open without auth
      await Linking.openURL(`${WEB_APP_URL}${path}`);
      return;
    }

    // Construct URL with auth tokens
    const authUrl = new URL(`${WEB_APP_URL}/auth/token`);
    authUrl.searchParams.set('access_token', session.access_token);
    authUrl.searchParams.set('refresh_token', session.refresh_token);
    authUrl.searchParams.set('redirect', path);

    // Open URL in browser
    const url = authUrl.toString();
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.error('Cannot open URL:', url);
      // Fallback: Open without auth
      await Linking.openURL(`${WEB_APP_URL}${path}`);
    }
  } catch (error) {
    console.error('Error opening web with auth:', error);
    // Fallback: Open without auth
    try {
      await Linking.openURL(`${WEB_APP_URL}${path}`);
    } catch (fallbackError) {
      console.error('Failed to open URL even without auth:', fallbackError);
    }
  }
}

/**
 * Opens a specific challenge in the web editor with auth
 * @param challengeId - The ID of the challenge to open
 */
export async function openChallengeInWeb(challengeId: string): Promise<void> {
  await openWebWithAuth(`/challenge/${challengeId}`);
}

/**
 * Opens the home page in web with auth
 */
export async function openHomeInWeb(): Promise<void> {
  await openWebWithAuth('/');
}
