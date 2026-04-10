import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/tasks';

async function runTests() {
  console.log('🧪 Starting PrecisionTask API Verification...\n');

  try {
    // 1. Create a Task
    console.log('Step 1: Creating a test task...');
    const createRes = await axios.post(BASE_URL, { title: 'Test Task for Recruiters' });
    const taskId = createRes.data._id;
    console.log('✅ Task created with ID:', taskId);

    // 2. Fetch Tasks
    console.log('\nStep 2: Verifying task list...');
    const listRes = await axios.get(BASE_URL);
    const found = listRes.data.find((t: any) => t._id === taskId);
    if (found) console.log('✅ Task found in list!');
    else throw new Error('Task not found in list after creation');

    // 3. Update Title (The Bonus Feature!)
    console.log('\nStep 3: Testing Title Edit...');
    const updateRes = await axios.patch(`${BASE_URL}/${taskId}`, { title: 'Updated Title' });
    if (updateRes.data.title === 'Updated Title') console.log('✅ Title update successful!');
    else throw new Error('Title was not updated correctly');

    // 4. Toggle Completion
    console.log('\nStep 4: Testing Completion Toggle...');
    const toggleRes = await axios.patch(`${BASE_URL}/${taskId}`, { completed: true });
    if (toggleRes.data.completed === true) console.log('✅ Completion toggle successful!');
    else throw new Error('Completion status was not toggled correctly');

    // 5. Delete Task
    console.log('\nStep 5: Testing Task Deletion...');
    await axios.delete(`${BASE_URL}/${taskId}`);
    const finalRes = await axios.get(BASE_URL);
    const stillExists = finalRes.data.find((t: any) => t._id === taskId);
    if (!stillExists) console.log('✅ Task deletion successful!');
    else throw new Error('Task still exists after deletion');

    console.log('\n🎉 ALL TESTS PASSED! Your backend is production-ready.');
  } catch (error: any) {
    console.error('\n❌ TEST FAILED:', error.message);
    if (error.response) console.error('Response:', error.response.data);
  }
}

runTests();
