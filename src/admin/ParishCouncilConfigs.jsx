import React, { useState, useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import TermsConfig from './TermsConfig';
import RolesConfig from './RolesConfig';
import { useUpsertInits } from '../server/InitsHandle';
import { ADConfigsSubmitBtn } from './AdminCustomes';
import { typeRoles, typeTerms } from '../Constain';
import ParishCouncilConfig from './ParishCouncilConfig';

export default function ParishCouncilConfigs({
  inits,
  isAdmin,
  isMod,
  churchData,
}) {
  const { upsertInits, loading } = useUpsertInits();
  // State nâng lên cha
  const initTerms = useMemo(
    () => inits.find((i) => i.type === typeTerms),
    [inits]
  );
  const initRoles = useMemo(
    () => inits.find((i) => i.type === typeRoles),
    [inits]
  );
  const [termsData, setTermsData] = useState(() => {
    try {
      return initTerms ? JSON.parse(initTerms.data) : [];
    } catch {
      return [];
    }
  });
  const [rolesData, setRolesData] = useState(() => {
    try {
      return initRoles ? JSON.parse(initRoles.data) : [];
    } catch {
      return [];
    }
  });
  const handleSubmitAll = async () => {
    if (termsData.length) {
      await upsertInits({
        type: typeTerms,
        data: termsData,
      });
    }
    if (rolesData.length) {
      await upsertInits({
        type: typeRoles,
        data: rolesData,
      });
    }
    window.location.reload();
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr' },
          gap: 2,
          color: 'white',
        }}
      >
        {initTerms && (
          <TermsConfig
            initTerms={initTerms}
            isAdmin={isAdmin}
            isMod={isMod}
            termsData={termsData}
            setTermsData={setTermsData} // truyền setter xuống
          />
        )}
        {initRoles && (
          <RolesConfig
            initRoles={initRoles}
            isAdmin={isAdmin}
            isMod={isMod}
            rolesData={rolesData}
            setRolesData={setRolesData} // truyền setter xuống
          />
        )}
      </Box>
      <ADConfigsSubmitBtn handleSubmit={handleSubmitAll} loading={loading} />
      <Typography
        sx={{ mt: 2, color: 'red', fontWeight: 'bold', textAlign: 'center' }}
      >
        *** If you want to add a member to the Parish Council for the new term
        and new role, you must first add the term and role before adding the
        member!
      </Typography>
      <ParishCouncilConfig
        inits={inits}
        isAdmin={isAdmin}
        isMod={isMod}
        initTerms={initTerms}
        initRoles={initRoles}
        churchData={churchData}
      />
    </>
  );
}
