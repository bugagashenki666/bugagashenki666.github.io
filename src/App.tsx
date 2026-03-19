// @ts-nocheck
import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import { CustomProgress } from "./components/CustomProgress";
import { AsideMenu } from "./components/AsideMenu";
import { Box, Container, Flex } from "@chakra-ui/react";
import { Page } from "./components/Page";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { Error } from "./components/Error";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Perform GET request on mount
    axios
      .get(
        `https://api.corporation.skroy.ru/organization/employee?add_organization_data=true&add_profile_data=true`,
        {
          headers: {
            "Project-ID": "2c03471b-7792-4f9a-aa8a-6811810959f0",
            Authorization: `bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsidXNlcl9pZCI6IjVkYzQxYzJjLWRkOGEtNGIzNy04NDRlLTQ1ZTA2MzA0Y2NiZSIsImRldmljZV9pZCI6ImRldmljZV9pZCAod2lwKSIsInVzZXJfaXAiOiJ1c2VyX2lwICh3aXApIiwicHJvZmlsZV9pZCI6Ijg5OGNjZmY0LWJhMTktNGE1Mi1hM2UzLTRiNjMxMDQ3ZTZhOSIsImFjY291bnRfaWQiOiI5ZmUyMDY4Ny00MDM2LTQ4YmEtOTUxZC00NTgwOTIwMTIyODgiLCJwcm9qZWN0X2lkIjoiMmMwMzQ3MWItNzc5Mi00ZjlhLWFhOGEtNjgxMTgxMDk1OWYwIn0sImlhdCI6MTc3Mzg0ODc3MywiZXhwIjoxNzczODkxOTczfQ.pGW9nOKhcv7ku8YgSav9IUVJP7-K9LjHZwtRTtF0gGPQr-vynTORDdK_I8O1a8zWBhUeVRULW6u_KK37vrnagBfkvZqKL7CQIYocNpJLZtuxy7tB2vTv-GdLzuNLdlZKPc0EUMhygsCjHDOD4O3E0Wg50uyBExLbnT216xiNi5IYMtKiJJz5NVpwfj-UyBPpBroTsc3O7Eg8Dr2rymhT3G30UmNuwWnyclIzR9VmteyZs4cv9g2KgCayTzudCUPkDbnKGHNHzlh_z7vsiURyLJcedwIUm1C-9-bBYS7Mh0wmm0DKeCy_OlovxYx3mJi72oZGShmDq6vWXzu4R2lEbcRLVN7OUMKE_B2tI1uB2lEDWUY-kXij_i_SuUOeXrKLRNza1NPgBvKUjsKY3kSDhVXeqNv879jfeomTlb4VqU7QCLxnikY6kGcuS_uDXaEFPN7XLO0J0w4iiCLff0OJj2bmnmwiywQiq5-uimhsr9kJLTCvpBDV7idYuBwQbYhC3f-3FB8IASWvsEQeEHJtqcp3x-a6WboJVWajKVhma8O03b4O2qGBu-H-r0EXTF4Cpdl6271CeIspVyM0OuL39Tccr7nqYazSTDNz_6pus4qPgyLq36D8Qimp-ZInYHaBYj5E0m8MT1xykAIYXdJZIFHyraAqWjkDLCZFlOSqmps`,
          },
        },
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
        setData(err);
      });
  }, []);

  if (loading) return <CustomProgress />;
  if (error) {
    return <Error data={data} />;
  }
  let filterOrg: [] = [];
  for (let i = 0; i < data.data.length; i++) {
    for (let j = 0; j < data.data[i].organization_data.length; j++) {
      const label =
        data.data[i].organization_data[j].additional_info &&
        data.data[i].organization_data[j].additional_info.title_abbreviation
          ? data.data[i].organization_data[j].additional_info.title_abbreviation
          : data.data[i].organization_data[j].title;
      const value = data.data[i].organization_data[j].organization_id;
      if (
        !filterOrg.find((obj) => obj.label === label && obj.value === value)
      ) {
        filterOrg.push({label: label, value: value});
      }
    }
  }
  let filterPos: [] = [];
  for (let i = 0; i < data.data.length; i++) {
    let position =
      data.data[i].profile_data.project_info &&
      data.data[i].profile_data.project_info.category
        ? data.data[i].profile_data.project_info.category
        : "должность не указана";
    position = position.trim();
    if (!filterPos.find((obj) => obj.label === position)) {
      filterPos.push({ label: position, value: position });
    }
  }
  console.log(filterPos);
  for(let i = 0 ; i < filterPos.length ; i++) {
    console.log(filterPos[i].label);
    for(let j = 0 ; j < filterPos[i].label.length ; j++) {
      console.log(filterPos[i].label.charCodeAt(j));
    }
  }

  return (
    <Container maxW="1920px">
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems={"stretch"}
        gap="24px"
      >
        <AsideMenu width="240px" padding="20px">
          <Flex h="100%" flexDirection="column" justifyContent="center">
            <Box>Aside menu</Box>
          </Flex>
        </AsideMenu>
        <Page maxW="1720px" width="100%">
          <Header width="100%" minH="56px" />
          <Main
            width="100%"
            height="100%"
            data={data.data}
            filterOrg={filterOrg}
            filterPos={filterPos}
          />
        </Page>
      </Flex>
    </Container>
  );
}

export default App;
