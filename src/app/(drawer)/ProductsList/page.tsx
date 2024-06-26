"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalFilter } from "@/context/filterContext";
import {
  Box,
  FormControl,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Product, useGlobalProducts } from "@/context/productList";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SampleProduct from "../../../assets/images/sample_product.jpg";
import SearchIcon from "@mui/icons-material/Search";
import { useLoader } from "@/context/loaderContext";

export default function ProductsList() {
  const innerBoxRef = useRef(null);
  const { setGlobalLoading, goToSingleProduct } = useLoader();
  const {
    sorting,
    sortingValue,
    setSortingValue,
    filterProducts,
    setSearchValue,
    searchValue,
    allProducts,
    setCategoryValue,
    categoryValue,
    setBrandValue,
  } = useGlobalFilter();
  const [age, setAge] = useState("lowest");
  const [brand, setBrand] = useState("All");
  const router = useRouter();
  const { enableOuterScroll, setEnableOuterScroll } = useGlobalProducts();

  useEffect(() => {
    setGlobalLoading(false);
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setAge(event.target.value as string);
    setSortingValue(event.target.value as string);
    sorting();
  };
  const handleChange1 = (event: SelectChangeEvent) => {
    console.log(event.target.value as string);
    setBrand(event.target.value as string);
    setBrandValue(event.target.value as string);
  };

  const getUniqueCategory = (data: any) => {
    let newVal = data.map((currElem: any) => {
      return currElem.beverageCategory;
    });
    return (newVal = ["All", ...new Set(newVal)]);
  };
  const getUniqueBrand = (data: any) => {
    let newVal = data.map((currElem: any) => {
      return currElem.beverageBrand;
    });
    return (newVal = ["All", ...new Set(newVal)]);
  };

  const categoryOnlyData = getUniqueCategory(allProducts);
  const brandOnlyData = getUniqueBrand(allProducts);

  const handleInnerScroll = (e: any) => {
    const element = e.target;
    const atBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    console.log(atBottom);
    if (atBottom) {
      // Enable the outer scroll when the inner scroll reaches the end
      setEnableOuterScroll(true);
    } else {
      // Disable the outer scroll when not at the bottom of the inner scroll
      setEnableOuterScroll(false);
    }
  };

  return (
    <>
      <Box className="flex justify-center mt-5">
        <Box className="flex gap-8">
          <Box>
            <TextField
              variant="outlined"
              size="small"
              className="mb-5"
              placeholder="search..."
              onChange={(e) => setSearchValue(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Typography className="text-xl font-medium mb-2">
                Category
              </Typography>
              {categoryOnlyData.map((currElem: any, index) => {
                const isActive = currElem.toString() === categoryValue;
                return (
                  <Typography
                    className={`cursor-pointer ${
                      isActive ? "text-primary" : ""
                    }`}
                    onClick={() => setCategoryValue(currElem.toString())}
                    key={index}
                  >
                    {currElem.toString()}
                  </Typography>
                );
              })}
            </Box>
            <Box>
              <Typography className="text-xl font-medium mb-2 mt-5">
                Brand
              </Typography>
              <FormControl className="max-w-[200px]" fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={brand}
                  onChange={handleChange1}
                  displayEmpty
                >
                  {brandOnlyData.map((currElem: any, index) => {
                    return (
                      <MenuItem value={currElem.toString()} key={index}>
                        {currElem.toString()}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box className="w-full max-w-[980px]">
            <Box className="flex items-center justify-between mb-5">
              <Typography className="text-2xl text-blue-[800] font-medium">
                Products
              </Typography>
              <FormControl className="max-w-[200px]" fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={age}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="lowest">Price: Low to High</MenuItem>
                  <MenuItem value="highest">Price: High to Low</MenuItem>
                  <MenuItem value="ascending">Ascending Order</MenuItem>
                  <MenuItem value="descending">Descending Order</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Box
                ref={innerBoxRef}
                onScroll={handleInnerScroll}
                className="m-auto w-fit pb-3 overflow-auto h-[calc(100vh-148px)]"
              >
                <Box className="grid grid-cols-4 gap-8">
                  {filterProducts.map((currElem) => {
                    return (
                      <Box
                        key={currElem._id}
                        className="max-w-[255px] shadow-lg"
                      >
                        <Box
                          className=" bg-white-[200] flex items-center justify-center cursor-pointer"
                          onClick={() => goToSingleProduct(currElem._id)}
                        >
                          <Image
                            className="w-[200px]"
                            src={SampleProduct}
                            alt="Sample Product"
                          />
                        </Box>
                        <Box className="bg-white px-6 py-4 text-left">
                          <Typography className="text-base text-blue-[900] font-medium">
                            {currElem.productName}
                          </Typography>
                          <Typography className="font-xl text-right text-primary">
                            ${currElem.productPrice}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
