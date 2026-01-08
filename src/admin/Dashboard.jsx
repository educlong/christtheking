import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Logos from './Logos';
import { CustomAccordion, CustomDetails, CustomSummary } from './DashboardCss';
import { useDeleteImage } from '../server/ImgsHandle';
import WeeklyBulletin from './Bulletin';
import MenuForm from './PagesConfig';
import Outsources from './Outsources';
import ChurchInfo from './ChurchInfo';
import { useFetchInit, useSendAnnouncement } from '../server/InitsHandle';
import { now, typeAuth, typeMass, typePages, typeParishers } from '../Constain';
import SacramentsForm from './Sacraments';
import AnnouncementsForm from './Announcements';
import AdvertisingContactForm from './AdsInfo';
import { AdsImg } from './AdminCustomes';
import FirstBible from './firstBible';
import PastorsConfig from './PastorsConfig';
import ParishCouncilConfigs from './ParishCouncilConfigs';
import FormConfigs from './FormConfigs';
import PostConfigs from './PostConfigs';
import ParishersConfig from './ParishersConfig';
import { useMemo, useState } from 'react';

// ===== Component =====
export default function Dashboard({ auth, inits, posts, images }) {
  const { deleteImage } = useDeleteImage();
  const { sendAnnouncement } = useSendAnnouncement();
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this logo?')) return;
    await deleteImage({
      id: id,
      onSuccess: () => {
        window.location.reload(); // <-- reload trang
      },
    });
  };
  const { init: authUsersInit } = useFetchInit(typeAuth);
  const authUsers =
    authUsersInit && authUsersInit.length > 0
      ? JSON.parse(authUsersInit[0].data)
      : '';
  const isAdmin =
    auth &&
    authUsers &&
    auth?.expires > now &&
    authUsers?.length >= 3 &&
    auth.usn === authUsers[0].usn &&
    auth.auth === authUsers[0].auth;
  const isMod =
    auth &&
    authUsers &&
    auth?.expires > now &&
    authUsers?.length >= 3 &&
    auth.usn === authUsers[1].usn &&
    auth.auth === authUsers[1].auth;
  const isUser =
    auth &&
    authUsers &&
    auth?.expires > now &&
    authUsers?.length >= 3 &&
    auth.usn === authUsers[2].usn &&
    auth.auth === authUsers[2].auth;

  const parishersInit = useMemo(
    () => [inits.find((item) => item.type === typeParishers)],
    [inits]
  );
  const churchInit = useMemo(
    () => [inits.find((item) => item.type === typeMass)],
    [inits]
  );
  const pagesInit = useMemo(
    () => [inits.find((item) => item.type === typePages)],
    [inits]
  );
  const parishersData = useMemo(() => {
    if (!parishersInit?.length) return null;
    try {
      return JSON.parse(parishersInit[0].data);
    } catch {
      return null;
    }
  }, [parishersInit]);
  const churchData = useMemo(() => {
    if (!churchInit?.length) return null;
    try {
      return JSON.parse(churchInit[0].data)[0].content;
    } catch {
      return null;
    }
  }, [churchInit]);
  const pagesData = useMemo(() => {
    if (pagesInit.length > 0) {
      try {
        return JSON.parse(pagesInit[0].data);
      } catch {
        return [];
      }
    }
    return [];
  }, [pagesInit]);
  const emailsParishers = useMemo(() => {
    if (!parishersData?.listparishers) return [];
    return [
      ...new Set(
        parishersData.listparishers.map((p) => p.email?.trim()).filter(Boolean)
      ),
    ];
  }, [parishersData]);
  const [showParishers, setShowParishers] = useState(false);
  return (
    inits &&
    inits.length > 0 && (
      <div>
        {isAdmin && (
          <CustomAccordion>
            <CustomSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                Update Outsources Information
              </Typography>
            </CustomSummary>
            <CustomDetails>
              <Outsources
                inits={inits}
                isAdmin={isAdmin}
                isMod={isMod}
                maxSize={40}
                notes={`*Image size must be ${40}x${40} or smaller!`}
              />
            </CustomDetails>
          </CustomAccordion>
        )}
        {(isAdmin || isMod) && (
          <CustomAccordion>
            <CustomSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Update Pastors</Typography>
            </CustomSummary>
            <CustomDetails>
              <PastorsConfig inits={inits} isAdmin={isAdmin} isMod={isMod} />
            </CustomDetails>
          </CustomAccordion>
        )}
        {(isAdmin || isMod) && (
          <CustomAccordion>
            <CustomSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Update Structure</Typography>
            </CustomSummary>
            <CustomDetails>
              {/* logo_parish' : 'logo_holyyear'; */}
              {(isAdmin || isMod) && (
                <Logos
                  inits={inits}
                  titleUpload="Upload Logo Parish"
                  type="logo_parish" // Xác định type cho backend
                  upload={true}
                  notes={`*Image size must be ${800}x${800} or smaller!`}
                  imgSelect="Choose Image"
                  maxWPic={800}
                  maxHPic={800}
                  submit="Submit"
                />
              )}
              {(isAdmin || isMod) && (
                <Logos
                  inits={inits}
                  titleUpload="Upload Logo Holy Year"
                  type="logo_holyyear" // Xác định type cho backend
                  upload={true}
                  notes={`*Image size must be ${500}x${500} or smaller!`}
                  imgSelect="Choose Image"
                  maxWPic={500}
                  maxHPic={500}
                  submit="Submit"
                />
              )}
              {isAdmin && (
                <Logos
                  inits={inits}
                  titleUpload="Add Ads"
                  type="pics_ads" // Xác định type cho backend
                  upload={false}
                  notes={`*Image size must be ${1000}x${1000} or smaller!`}
                  imgSelect="Choose Image"
                  maxWPic={1000}
                  maxHPic={1000}
                  submit="Submit"
                />
              )}
              {images && images.length <= 0
                ? ''
                : isAdmin && (
                    <AdsImg
                      images={images}
                      handleDelete={handleDelete}
                      size={40}
                      noChangeFirstImg
                    />
                  )}
              {isAdmin && <CustomDetails>Upload "Home"</CustomDetails>}
              {isAdmin && <CustomDetails>Upload "Language"</CustomDetails>}
              {isAdmin && <AdvertisingContactForm inits={inits} />}
            </CustomDetails>
          </CustomAccordion>
        )}
        {(isAdmin || isMod) &&
          churchInit &&
          churchInit.length > 0 &&
          churchData && (
            <CustomAccordion>
              <CustomSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Update Parish Council</Typography>
              </CustomSummary>
              <CustomDetails>
                <ParishCouncilConfigs
                  inits={inits}
                  isAdmin={isAdmin}
                  isMod={isMod}
                  churchData={churchData}
                />
              </CustomDetails>
            </CustomAccordion>
          )}
        {(isAdmin || isMod) &&
          pagesInit &&
          pagesInit.length > 0 &&
          pagesData && (
            <CustomAccordion>
              <CustomSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">
                  Update Pages Information
                </Typography>
              </CustomSummary>
              <CustomDetails>
                <MenuForm isAdmin={isAdmin} pagesData={pagesData} />
              </CustomDetails>
            </CustomAccordion>
          )}
        {(isAdmin || isMod) && (
          <CustomAccordion>
            <CustomSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">
                Update Church Information
              </Typography>
            </CustomSummary>
            {churchInit && churchInit.length > 0 && churchData && (
              <CustomDetails>
                <ChurchInfo
                  isAdmin={isAdmin}
                  isMod={isMod}
                  massInit={churchInit}
                  emailsParishers={emailsParishers}
                />
              </CustomDetails>
            )}
            <CustomDetails>
              <SacramentsForm inits={inits} isAdmin={isAdmin} />
            </CustomDetails>
          </CustomAccordion>
        )}
        {(isAdmin || isMod || isUser) && (
          <CustomAccordion defaultExpanded={true}>
            <CustomSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Post</Typography>
            </CustomSummary>
            {isAdmin && (
              <CustomDetails>
                <FirstBible inits={inits} />
              </CustomDetails>
            )}
            <CustomDetails>
              <AnnouncementsForm
                inits={inits}
                isAdmin={isAdmin}
                notes="***Maximum 250 characters"
                sendAnnouncement={sendAnnouncement}
                emailsParishers={emailsParishers}
              />
            </CustomDetails>
            <CustomDetails>
              <WeeklyBulletin
                inits={inits}
                type={'bulletin'}
                notes={'*File size must be 1.0 MB or smaller!'}
                sendAnnouncement={sendAnnouncement}
                emailsParishers={emailsParishers}
              />
            </CustomDetails>
            {pagesInit &&
              pagesInit.length > 0 &&
              pagesData &&
              churchInit &&
              churchInit.length > 0 &&
              churchData && (
                <CustomDetails>
                  <PostConfigs
                    _posts={posts}
                    isAdmin={isAdmin}
                    pages={pagesData}
                    church={churchData}
                    sendAnnouncement={sendAnnouncement}
                    emailsParishers={emailsParishers}
                  />
                </CustomDetails>
              )}
          </CustomAccordion>
        )}
        {(isAdmin || isMod) && (
          <CustomAccordion>
            <CustomSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">Update Forms</Typography>
            </CustomSummary>
            <CustomDetails>
              <FormConfigs
                inits={inits}
                isAdmin={isAdmin}
                maxSize={120}
                notes={`*Image size must be ${120}x${120} or smaller!`}
              />
            </CustomDetails>
          </CustomAccordion>
        )}
        {(isAdmin || isMod) &&
          churchInit &&
          churchInit.length > 0 &&
          churchData &&
          parishersInit &&
          parishersInit.length > 0 &&
          parishersData && (
            <CustomAccordion>
              <CustomSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">Parishers</Typography>
              </CustomSummary>
              <CustomDetails>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowParishers((prev) => !prev)}
                  >
                    {showParishers ? 'Hide Parishers' : 'Show Parishers'}
                  </Button>
                </Box>
                {showParishers && (
                  <ParishersConfig
                    isAdmin={isAdmin}
                    isMod={isMod}
                    church={churchData}
                    parishersData={parishersData}
                  />
                )}
              </CustomDetails>
            </CustomAccordion>
          )}
      </div>
    )
  );
}
