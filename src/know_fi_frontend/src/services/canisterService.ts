import { Identity } from '@dfinity/agent';

// Import all canister actors
import { canisterId as authCanisterId, createActor as createAuthActor } from '../../../declarations/auth';
import { canisterId as coursesCanisterId, createActor as createCoursesActor } from '../../../declarations/courses';
import { createActor as createForumActor, canisterId as forumCanisterId } from '../../../declarations/forum';
import { createActor as createNFTActor, canisterId as NFTCanisterId } from '../../../declarations/icrc7';
import { createActor as createProfileActor, canisterId as profileCanisterId } from '../../../declarations/profile';
import { createActor as createQuestActor, canisterId as questCanisterId } from '../../../declarations/quests';
import { createActor as createQuizActor, canisterId as quizCanisterId } from '../../../declarations/quiz';

export interface CanisterConfig {
  host: string;
  identity: Identity;
}

export interface Actors {
  auth: ReturnType<typeof createAuthActor>;
  courses: ReturnType<typeof createCoursesActor>;
  forum: ReturnType<typeof createForumActor>;
  profile: ReturnType<typeof createProfileActor>;
  quest: ReturnType<typeof createQuestActor>;
  quiz: ReturnType<typeof createQuizActor>;
  nft: ReturnType<typeof createNFTActor>;
}

export interface CanisterIds {
  auth: string;
  courses: string;
  forum: string;
  profile: string;
  quest: string;
  quiz: string;
  nft: string;
}

class CanisterService {
  private actors: Actors | null = null;
  private config: CanisterConfig | null = null;

  /**
   * Initialize all canister actors with identity and host
   */
  async initializeActors(identity: Identity, host?: string): Promise<Actors> {
    const network = process.env.NEXT_PUBLIC_DFX_NETWORK || 'local';
    const isLocal = network !== 'ic';

    this.config = {
      identity,
      host: host || (isLocal ? 'http://localhost:4943' : 'https://icp0.io'),
    };

    const agentOptions = {
      identity: this.config.identity,
      host: this.config.host,
    };

    // Create all actors with the same configuration
    this.actors = {
      auth: createAuthActor(authCanisterId, { agentOptions }),
      courses: createCoursesActor(coursesCanisterId, { agentOptions }),
      forum: createForumActor(forumCanisterId, { agentOptions }),
      profile: createProfileActor(profileCanisterId, { agentOptions }),
      quest: createQuestActor(questCanisterId, { agentOptions }),
      quiz: createQuizActor(quizCanisterId, { agentOptions }),
      nft: createNFTActor(NFTCanisterId, { agentOptions }),
    };

    return this.actors;
  }

  /**
   * Get all actors (throws if not initialized)
   */
  getActors(): Actors {
    if (!this.actors) {
      throw new Error('Actors not initialized. Call initializeActors() first.');
    }
    return this.actors;
  }

  /**
   * Get specific actor by name
   */
  getActor<T extends keyof Actors>(name: T): Actors[T] {
    const actors = this.getActors();
    return actors[name];
  }

  /**
   * Update actors when identity changes
   */
  async updateActors(identity: Identity): Promise<Actors> {
    if (!this.config) {
      throw new Error('CanisterService not initialized');
    }

    return this.initializeActors(identity, this.config.host);
  }

  /**
   * Get all canister IDs
   */
  getCanisterIds(): CanisterIds {
    return {
      auth: authCanisterId,
      courses: coursesCanisterId,
      forum: forumCanisterId,
      profile: profileCanisterId,
      quest: questCanisterId,
      quiz: quizCanisterId,
      nft: NFTCanisterId,
    };
  }

  /**
   * Check if actors are initialized
   */
  isInitialized(): boolean {
    return this.actors !== null;
  }

  /**
   * Clear actors (useful for logout)
   */
  clearActors(): void {
    this.actors = null;
    this.config = null;
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    const network = process.env.NEXT_PUBLIC_DFX_NETWORK || 'local';
    const isLocal = network !== 'ic';

    return {
      network,
      isLocal,
      host: this.config?.host || (isLocal ? 'http://localhost:4943' : 'https://icp0.io'),
      identityProvider:
        network === 'ic'
          ? 'https://identity.ic0.app'
          : `http://${process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943/`,
    };
  }
}

// Export singleton instance
export const canisterService = new CanisterService();
export default canisterService;
