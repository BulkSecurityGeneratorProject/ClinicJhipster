package io.github.jhipster.application.web.rest;

import com.codahale.metrics.annotation.Timed;
import io.github.jhipster.application.domain.HealthChart;
import io.github.jhipster.application.repository.HealthChartRepository;
import io.github.jhipster.application.repository.search.HealthChartSearchRepository;
import io.github.jhipster.application.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.application.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing HealthChart.
 */
@RestController
@RequestMapping("/api")
public class HealthChartResource {

    private final Logger log = LoggerFactory.getLogger(HealthChartResource.class);

    private static final String ENTITY_NAME = "healthChart";

    private HealthChartRepository healthChartRepository;

    private HealthChartSearchRepository healthChartSearchRepository;

    public HealthChartResource(HealthChartRepository healthChartRepository, HealthChartSearchRepository healthChartSearchRepository) {
        this.healthChartRepository = healthChartRepository;
        this.healthChartSearchRepository = healthChartSearchRepository;
    }

    /**
     * POST  /health-charts : Create a new healthChart.
     *
     * @param healthChart the healthChart to create
     * @return the ResponseEntity with status 201 (Created) and with body the new healthChart, or with status 400 (Bad Request) if the healthChart has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/health-charts")
    @Timed
    public ResponseEntity<HealthChart> createHealthChart(@RequestBody HealthChart healthChart) throws URISyntaxException {
        log.debug("REST request to save HealthChart : {}", healthChart);
        if (healthChart.getId() != null) {
            throw new BadRequestAlertException("A new healthChart cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HealthChart result = healthChartRepository.save(healthChart);
        healthChartSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/health-charts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /health-charts : Updates an existing healthChart.
     *
     * @param healthChart the healthChart to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated healthChart,
     * or with status 400 (Bad Request) if the healthChart is not valid,
     * or with status 500 (Internal Server Error) if the healthChart couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/health-charts")
    @Timed
    public ResponseEntity<HealthChart> updateHealthChart(@RequestBody HealthChart healthChart) throws URISyntaxException {
        log.debug("REST request to update HealthChart : {}", healthChart);
        if (healthChart.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        HealthChart result = healthChartRepository.save(healthChart);
        healthChartSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, healthChart.getId().toString()))
            .body(result);
    }

    /**
     * GET  /health-charts : get all the healthCharts.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of healthCharts in body
     */
    @GetMapping("/health-charts")
    @Timed
    public List<HealthChart> getAllHealthCharts() {
        log.debug("REST request to get all HealthCharts");
        return healthChartRepository.findAll();
    }

    /**
     * GET  /health-charts/:id : get the "id" healthChart.
     *
     * @param id the id of the healthChart to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the healthChart, or with status 404 (Not Found)
     */
    @GetMapping("/health-charts/{id}")
    @Timed
    public ResponseEntity<HealthChart> getHealthChart(@PathVariable Long id) {
        log.debug("REST request to get HealthChart : {}", id);
        Optional<HealthChart> healthChart = healthChartRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(healthChart);
    }

    /**
     * DELETE  /health-charts/:id : delete the "id" healthChart.
     *
     * @param id the id of the healthChart to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/health-charts/{id}")
    @Timed
    public ResponseEntity<Void> deleteHealthChart(@PathVariable Long id) {
        log.debug("REST request to delete HealthChart : {}", id);

        healthChartRepository.deleteById(id);
        healthChartSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/health-charts?query=:query : search for the healthChart corresponding
     * to the query.
     *
     * @param query the query of the healthChart search
     * @return the result of the search
     */
    @GetMapping("/_search/health-charts")
    @Timed
    public List<HealthChart> searchHealthCharts(@RequestParam String query) {
        log.debug("REST request to search HealthCharts for query {}", query);
        return StreamSupport
            .stream(healthChartSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }

}
