import axios, { AxiosResponse } from 'axios';
import { ApiResponse, Banner, CreateBannerRequest } from './src/types';

// API Base URL
const API_BASE_URL = 'http://localhost:3001';

// Test banner data
const testBanner: CreateBannerRequest = {
  title: 'Welcome to Celebration Diamond',
  description: 'Discover our exquisite collection of diamond jewelry',
  text: 'Get 20% off on all diamond rings this month!',
  linkText: 'Shop Now',
  linkUrl: 'https://celebrationdiamond.com/products',
  backgroundColor: '#f8f9fa',
  textColor: '#212529',
  isActive: true,
  priority: 1
};

// Test functions
async function testBannerAPI(): Promise<void> {
  console.log('🧪 Testing Banner API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse: AxiosResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('');

    // Test 2: Get all banners (should be empty initially)
    console.log('2. Getting all banners...');
    try {
      const getBannersResponse: AxiosResponse<ApiResponse<Banner[]>> = await axios.get(`${API_BASE_URL}/api/banners`);
      console.log('✅ Get banners successful:', getBannersResponse.data);
    } catch (error: any) {
      console.log('ℹ️  No banners found (expected for new database)');
    }
    console.log('');

    // Test 3: Create a banner (without auth for now)
    console.log('3. Creating a test banner...');
    try {
      const createResponse: AxiosResponse<ApiResponse<Banner>> = await axios.post(`${API_BASE_URL}/api/banners`, testBanner);
      console.log('✅ Banner created successfully:', createResponse.data);
      const bannerId = createResponse.data.data?.id;
      console.log('');

      if (bannerId) {
        // Test 4: Get banner by ID
        console.log('4. Getting banner by ID...');
        const getBannerResponse: AxiosResponse<ApiResponse<Banner>> = await axios.get(`${API_BASE_URL}/api/banners/${bannerId}`);
        console.log('✅ Get banner by ID successful:', getBannerResponse.data);
        console.log('');

        // Test 5: Update banner
        console.log('5. Updating banner...');
        const updateData: CreateBannerRequest = {
          ...testBanner,
          text: 'Updated: Get 25% off on all diamond rings this month!',
          priority: 2
        };
        const updateResponse: AxiosResponse<ApiResponse<Banner>> = await axios.put(`${API_BASE_URL}/api/banners/${bannerId}`, updateData);
        console.log('✅ Banner updated successfully:', updateResponse.data);
        console.log('');

        // Test 6: Get all banners again
        console.log('6. Getting all banners after update...');
        const getBannersResponse2: AxiosResponse<ApiResponse<Banner[]>> = await axios.get(`${API_BASE_URL}/api/banners`);
        console.log('✅ Get banners after update:', getBannersResponse2.data);
        console.log('');

        // Test 7: Toggle banner status
        console.log('7. Toggling banner status...');
        const toggleResponse: AxiosResponse<ApiResponse<Banner>> = await axios.patch(`${API_BASE_URL}/api/banners/${bannerId}/toggle`);
        console.log('✅ Banner status toggled:', toggleResponse.data);
        console.log('');

        // Test 8: Delete banner
        console.log('8. Deleting banner...');
        const deleteResponse: AxiosResponse<ApiResponse> = await axios.delete(`${API_BASE_URL}/api/banners/${bannerId}`);
        console.log('✅ Banner deleted successfully:', deleteResponse.data);
        console.log('');
      }

    } catch (error: any) {
      if (error.response) {
        console.log('❌ API Error:', error.response.status, error.response.data);
      } else {
        console.log('❌ Network Error:', error.message);
      }
    }

  } catch (error: any) {
    console.log('❌ Server not running. Please start the API server first:');
    console.log('   cd api && npm install && npm run dev');
    console.log('');
    console.log('Error:', error.message);
  }
}

// Run the test
testBannerAPI();




















