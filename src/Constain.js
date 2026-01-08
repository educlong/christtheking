import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';

// backend
export const backend = 'https://christ-the-king-backend.onrender.com/';
export const website = 'http://localhost:5173/';
export const now = new Date(); // lấy thời gian hiện tại
export const Homepage = 'HOME';
// size của logo claresholm
export const sizePic = ['40%', 'auto'];
// check URL
export const checkUrl = (activePage, page, location) =>
  activePage.includes(page) && location.pathname !== `/${Homepage}`;
// nếu cuộn chuột xuống 100px thì header 1 sẽ biến mất
export const NumberScrollToDisappearHeader = 100;
export const iconMap = {
  PersonIcon,
  ManageAccountsIcon,
  DashboardIcon,
  LogoutIcon,
  EmailIcon,
  LockIcon,
  AccountCircle,
  GoogleIcon,
};
export const logo_holyyear = 'logo_holyyear';
export const logo_parish = 'logo_parish';
export const pics_ads = 'pics_ads';
export const typePages = 'pages';
export const typeAnnouncement = 'announcement';
export const typeMass = 'mass';
export const typeRenew = 'renew';
export const typeAds_info = 'ads_info';
export const typeLanguages = 'languages';
export const typeSacraments = 'sacraments';
export const typePastors = 'pastors';
export const typeBulletin = 'bulletin';
export const typeParishCouncil = 'parishcouncil';
export const typeFormNote = 'formNote';
export const typeFormFiles = 'formFiles';
export const typeRoles = 'roles';
export const typeTerms = 'terms';
export const typeFirstBible = 'firstBible';
export const typeParishers = 'parishers';
export const typeTime = 'time';
export const rolesPastor = [
  'First Pastor',
  'Pastor',
  'Associate Pastor',
  'First Chaplain',
  'Chaplain',
];
export const typeAuth = 'authUsers';

export const saveAuth = 'auth';
export const backgroundImageLoginRegister =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f';
export const seeMore = 'See more';
export const alarmWrongLogin = 'Wrong username or password!';
export const alarmEmailEmpty = 'Email Registration Submitted!';
export const alarmLoginByGoogle = 'Google Registration Clicked!';

export const displayxs = { xs: 'block', sm: 'none' };
export const displayxssm = { xs: 'block', md: 'none' };
export const displaysm = { xs: 'none', sm: 'block' };
export const displaymd = { xs: 'none', md: 'block' };
export const displayxsmd = { xs: 'block', sm: 'none', md: 'block' };
export const displayFlexmd = { xs: 'none', md: 'flex' };
export const displayFlexsm = { xs: 'none', sm: 'flex' };
export const displayFlexxs = { xs: 'flex', md: 'none' };
export const displaylg = { xs: 'none', lg: 'block' };
export const settings = [
  { name: 'Login', icon: PersonIcon },
  // { name: 'Account', icon: ManageAccountsIcon },
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Logout', icon: LogoutIcon },
];

export const colorMainLetter = 'white';
export const colorSub1Letter = 'wheat';
export const colorSub2Letter = '#c9b8b8';
export const colorSub3Letter = '#ffffff';
export const colorSub4Letter = 'orange';
export const colorSub5Letter = 'yellow'; //hover
export const colorSub6Letter = 'lightblue';
export const colorSub7Letter = '#fdd80f';
export const colorSub8Letter = '#a3c8ed';
export const colorSub9Letter = 'rgb(25 118 210)';
export const colorSub10Letter = 'red';
export const colorSubLanguage = 'black';

export const bgColorSubTable = '#00000040';
export const bgColorSub2Table = '#373535';
export const bgColorSub3 = '#25272885';
export const bgColorBanner = 'primary.main';
export const bgColorLanguage = 'white';
export const bgColorSub4 = '#1976d2';
export const bgColorSub5 = '#1565c0';
export const bgColorSub6 = '#3b8ad9';

// export const borderColorSub1 = 'yellow';
export const tableParishCouncil = [
  'Committee',
  'Parish',
  'Leader',
  'Phone',
  'Number',
];
export const tableMemeryBook = [
  'Year',
  'Parish',
  'Chair of Council',
  'Pastoral Council',
];
export const maritalOptions = ['Married', 'Single', 'Divorced', 'Common Law'];

export const rightsideMenu = ['Messages', 'Notifications', 'Profile'];
// Login/Register page
export const LoginRegister = {
  login: {
    welcome: 'Welcome Back 👋',
    typing: [
      { name: 'Username', icon: AccountCircle },
      { name: 'Password', icon: LockIcon },
    ],
    btn: 'LOGIN',
  },
  register: {
    welcome: 'Create Your Account ✨',
    with: [{ auth3: 'CONTINUE WITH GOOGLE', icon: GoogleIcon }],
    typing: [
      { name: 'Email', icon: EmailIcon },
      { name: 'Username', icon: AccountCircle },
      { name: 'Password', icon: LockIcon },
    ],
    btn: 'REGISTER WITH EMAIL',
  },
};

// Dropdown menu:
export const getMenuPaperProps = ({ minWidth180 } = { minWidth180: 180 }) => ({
  elevation: 6,
  sx: {
    border: '2px solid white',
    backgroundColor: 'rgb(25 118 210)',
    color: 'white',
    mt: 1,
    borderRadius: '12px',
    minWidth: minWidth180,
    overflow: 'visible',
    boxShadow: '0px 4px 12px lightgreen, 0px 0px 2px rgba(0,0,0,0.05)',
    '& .MuiMenuItem-root': {
      py: 1.2,
      px: 2,
      borderRadius: '8px',
      mx: 1,
      mt: 0.5,
      transition: '0.2s',
    },
    '& .MuiMenuItem-root:hover': {
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
  },
});
