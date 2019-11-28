import { shallowMount } from '@vue/test-utils'
import Month from '@/components/Month.vue'

describe('Month.vue', () => {
  it('testing utility methods', () => {
    const wrapper = shallowMount(Month, {
      propsData: {
        startingDayOfTheWeek: 0, // monday
        days: 31
      }
    })
    // expect(wrapper.text()).toMatch()
  })
})
