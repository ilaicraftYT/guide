import djsAvatar from './assets/discord-avatar-djs.png';
import guideLogo from './assets/guide-logo.png';
import { 
    KirzuAvatar,
    AvocadoAvatar,
    SocramAvatar,
    NejireAvatar,
    AndreMorAvatar
} from './assets/avatars';

export default {
    avatars: {
        djs: djsAvatar,
        guide: guideLogo
    },
	profiles: {
	    user: {
			author: 'Usuario',
			avatar: 'djs',
            roleColor: '#5865F2'
		}, 
		bot: {
			author: 'Bot de pruebas',
			avatar: 'guide',
			bot: true
		},
        kirzu: {
            author: 'Kirzu~',
            avatar: KirzuAvatar,
            roleColor: '#7700FF'
        },
        awoo: {
            author: 'Avocado',
            avatar: AvocadoAvatar,
            roleColor: '#EC1BFF'
        },
        socram: {
            author: 'Socram09',
            avatar: SocramAvatar,
            roleColor: '#1BB0FF'
        },
        nejire: {
            author: 'ThisIsAName',
            avatar: NejireAvatar,
            roleColor: '#C586D5'
        },
        andre: {
            author: 'AndreMor',
            avatar: AndreMorAvatar,
            roleColor: '#FFDD00'
        }
	}
}