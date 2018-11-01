package io.github.jhipster.application.web.rest;

import io.github.jhipster.application.ClinicJhipsterApp;

import io.github.jhipster.application.domain.HealthChart;
import io.github.jhipster.application.repository.HealthChartRepository;
import io.github.jhipster.application.repository.search.HealthChartSearchRepository;
import io.github.jhipster.application.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;


import static io.github.jhipster.application.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the HealthChartResource REST controller.
 *
 * @see HealthChartResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ClinicJhipsterApp.class)
public class HealthChartResourceIntTest {

    private static final Float DEFAULT_HEIGHT = 1F;
    private static final Float UPDATED_HEIGHT = 2F;

    private static final Float DEFAULT_WEIGHT = 1F;
    private static final Float UPDATED_WEIGHT = 2F;

    private static final String DEFAULT_DIAGNOSIS = "AAAAAAAAAA";
    private static final String UPDATED_DIAGNOSIS = "BBBBBBBBBB";

    private static final String DEFAULT_TREATMENT = "AAAAAAAAAA";
    private static final String UPDATED_TREATMENT = "BBBBBBBBBB";

    @Autowired
    private HealthChartRepository healthChartRepository;

    /**
     * This repository is mocked in the io.github.jhipster.application.repository.search test package.
     *
     * @see io.github.jhipster.application.repository.search.HealthChartSearchRepositoryMockConfiguration
     */
    @Autowired
    private HealthChartSearchRepository mockHealthChartSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restHealthChartMockMvc;

    private HealthChart healthChart;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final HealthChartResource healthChartResource = new HealthChartResource(healthChartRepository, mockHealthChartSearchRepository);
        this.restHealthChartMockMvc = MockMvcBuilders.standaloneSetup(healthChartResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HealthChart createEntity(EntityManager em) {
        HealthChart healthChart = new HealthChart()
            .height(DEFAULT_HEIGHT)
            .weight(DEFAULT_WEIGHT)
            .diagnosis(DEFAULT_DIAGNOSIS)
            .treatment(DEFAULT_TREATMENT);
        return healthChart;
    }

    @Before
    public void initTest() {
        healthChart = createEntity(em);
    }

    @Test
    @Transactional
    public void createHealthChart() throws Exception {
        int databaseSizeBeforeCreate = healthChartRepository.findAll().size();

        // Create the HealthChart
        restHealthChartMockMvc.perform(post("/api/health-charts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(healthChart)))
            .andExpect(status().isCreated());

        // Validate the HealthChart in the database
        List<HealthChart> healthChartList = healthChartRepository.findAll();
        assertThat(healthChartList).hasSize(databaseSizeBeforeCreate + 1);
        HealthChart testHealthChart = healthChartList.get(healthChartList.size() - 1);
        assertThat(testHealthChart.getHeight()).isEqualTo(DEFAULT_HEIGHT);
        assertThat(testHealthChart.getWeight()).isEqualTo(DEFAULT_WEIGHT);
        assertThat(testHealthChart.getDiagnosis()).isEqualTo(DEFAULT_DIAGNOSIS);
        assertThat(testHealthChart.getTreatment()).isEqualTo(DEFAULT_TREATMENT);

        // Validate the HealthChart in Elasticsearch
        verify(mockHealthChartSearchRepository, times(1)).save(testHealthChart);
    }

    @Test
    @Transactional
    public void createHealthChartWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = healthChartRepository.findAll().size();

        // Create the HealthChart with an existing ID
        healthChart.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHealthChartMockMvc.perform(post("/api/health-charts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(healthChart)))
            .andExpect(status().isBadRequest());

        // Validate the HealthChart in the database
        List<HealthChart> healthChartList = healthChartRepository.findAll();
        assertThat(healthChartList).hasSize(databaseSizeBeforeCreate);

        // Validate the HealthChart in Elasticsearch
        verify(mockHealthChartSearchRepository, times(0)).save(healthChart);
    }

    @Test
    @Transactional
    public void getAllHealthCharts() throws Exception {
        // Initialize the database
        healthChartRepository.saveAndFlush(healthChart);

        // Get all the healthChartList
        restHealthChartMockMvc.perform(get("/api/health-charts?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(healthChart.getId().intValue())))
            .andExpect(jsonPath("$.[*].height").value(hasItem(DEFAULT_HEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].diagnosis").value(hasItem(DEFAULT_DIAGNOSIS.toString())))
            .andExpect(jsonPath("$.[*].treatment").value(hasItem(DEFAULT_TREATMENT.toString())));
    }
    
    @Test
    @Transactional
    public void getHealthChart() throws Exception {
        // Initialize the database
        healthChartRepository.saveAndFlush(healthChart);

        // Get the healthChart
        restHealthChartMockMvc.perform(get("/api/health-charts/{id}", healthChart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(healthChart.getId().intValue()))
            .andExpect(jsonPath("$.height").value(DEFAULT_HEIGHT.doubleValue()))
            .andExpect(jsonPath("$.weight").value(DEFAULT_WEIGHT.doubleValue()))
            .andExpect(jsonPath("$.diagnosis").value(DEFAULT_DIAGNOSIS.toString()))
            .andExpect(jsonPath("$.treatment").value(DEFAULT_TREATMENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingHealthChart() throws Exception {
        // Get the healthChart
        restHealthChartMockMvc.perform(get("/api/health-charts/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHealthChart() throws Exception {
        // Initialize the database
        healthChartRepository.saveAndFlush(healthChart);

        int databaseSizeBeforeUpdate = healthChartRepository.findAll().size();

        // Update the healthChart
        HealthChart updatedHealthChart = healthChartRepository.findById(healthChart.getId()).get();
        // Disconnect from session so that the updates on updatedHealthChart are not directly saved in db
        em.detach(updatedHealthChart);
        updatedHealthChart
            .height(UPDATED_HEIGHT)
            .weight(UPDATED_WEIGHT)
            .diagnosis(UPDATED_DIAGNOSIS)
            .treatment(UPDATED_TREATMENT);

        restHealthChartMockMvc.perform(put("/api/health-charts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedHealthChart)))
            .andExpect(status().isOk());

        // Validate the HealthChart in the database
        List<HealthChart> healthChartList = healthChartRepository.findAll();
        assertThat(healthChartList).hasSize(databaseSizeBeforeUpdate);
        HealthChart testHealthChart = healthChartList.get(healthChartList.size() - 1);
        assertThat(testHealthChart.getHeight()).isEqualTo(UPDATED_HEIGHT);
        assertThat(testHealthChart.getWeight()).isEqualTo(UPDATED_WEIGHT);
        assertThat(testHealthChart.getDiagnosis()).isEqualTo(UPDATED_DIAGNOSIS);
        assertThat(testHealthChart.getTreatment()).isEqualTo(UPDATED_TREATMENT);

        // Validate the HealthChart in Elasticsearch
        verify(mockHealthChartSearchRepository, times(1)).save(testHealthChart);
    }

    @Test
    @Transactional
    public void updateNonExistingHealthChart() throws Exception {
        int databaseSizeBeforeUpdate = healthChartRepository.findAll().size();

        // Create the HealthChart

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHealthChartMockMvc.perform(put("/api/health-charts")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(healthChart)))
            .andExpect(status().isBadRequest());

        // Validate the HealthChart in the database
        List<HealthChart> healthChartList = healthChartRepository.findAll();
        assertThat(healthChartList).hasSize(databaseSizeBeforeUpdate);

        // Validate the HealthChart in Elasticsearch
        verify(mockHealthChartSearchRepository, times(0)).save(healthChart);
    }

    @Test
    @Transactional
    public void deleteHealthChart() throws Exception {
        // Initialize the database
        healthChartRepository.saveAndFlush(healthChart);

        int databaseSizeBeforeDelete = healthChartRepository.findAll().size();

        // Get the healthChart
        restHealthChartMockMvc.perform(delete("/api/health-charts/{id}", healthChart.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<HealthChart> healthChartList = healthChartRepository.findAll();
        assertThat(healthChartList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the HealthChart in Elasticsearch
        verify(mockHealthChartSearchRepository, times(1)).deleteById(healthChart.getId());
    }

    @Test
    @Transactional
    public void searchHealthChart() throws Exception {
        // Initialize the database
        healthChartRepository.saveAndFlush(healthChart);
        when(mockHealthChartSearchRepository.search(queryStringQuery("id:" + healthChart.getId())))
            .thenReturn(Collections.singletonList(healthChart));
        // Search the healthChart
        restHealthChartMockMvc.perform(get("/api/_search/health-charts?query=id:" + healthChart.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(healthChart.getId().intValue())))
            .andExpect(jsonPath("$.[*].height").value(hasItem(DEFAULT_HEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(DEFAULT_WEIGHT.doubleValue())))
            .andExpect(jsonPath("$.[*].diagnosis").value(hasItem(DEFAULT_DIAGNOSIS.toString())))
            .andExpect(jsonPath("$.[*].treatment").value(hasItem(DEFAULT_TREATMENT.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HealthChart.class);
        HealthChart healthChart1 = new HealthChart();
        healthChart1.setId(1L);
        HealthChart healthChart2 = new HealthChart();
        healthChart2.setId(healthChart1.getId());
        assertThat(healthChart1).isEqualTo(healthChart2);
        healthChart2.setId(2L);
        assertThat(healthChart1).isNotEqualTo(healthChart2);
        healthChart1.setId(null);
        assertThat(healthChart1).isNotEqualTo(healthChart2);
    }
}
