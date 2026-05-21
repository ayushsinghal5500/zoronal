import { useState, useEffect, useRef, useCallback } from 'react';
import CompanyCard from '../components/CompanyCard';
import Hero from '../components/Hero';
import { getCompanies } from '../api/AppApi';
import { useSearchParams } from 'react-router-dom';
import { CompanyCardSkeleton } from '../components/common/Skeletons';

const Home = () => {
  const [companiesList, setCompaniesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('Name');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const urlSearchQuery = searchParams.get('search') || '';
  
  const observer = useRef();

  const fetchCompanies = async (query = '', pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await getCompanies(query, pageNum, 10);
      const { data, totalPages } = response.data;
      
      let newList = data || [];
      
      if (isLoadMore) {
        setCompaniesList(prev => [...prev, ...newList]);
      } else {
        setCompaniesList(newList);
      }
      
      setHasMore(pageNum < totalPages);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchCompanies(urlSearchQuery, 1, false);
  }, [urlSearchQuery, sortBy]);

  const lastElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
          const nextPage = prevPage + 1;
          fetchCompanies(urlSearchQuery, nextPage, true);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, urlSearchQuery]);

  const handleSearch = (query) => {
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <Hero 
        onCompanyAdded={() => fetchCompanies(urlSearchQuery, 1, false)} 
        onSearch={handleSearch} 
        onSort={setSortBy}
        initialSearch={urlSearchQuery} 
      />
      <main className="max-w-360 mx-auto px-4 sm:px-6 md:px-8 py-8">
        {loading && page === 1 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {companiesList.length > 0 ? (
              <div className="space-y-4">
                {companiesList.map((company, index) => {
                  if (companiesList.length === index + 1) {
                    return (
                      <div ref={lastElementRef} key={company._id || company.id}>
                        <CompanyCard company={company} />
                      </div>
                    );
                  } else {
                    return <CompanyCard key={company._id || company.id} company={company} />;
                  }
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No companies found. Add one to get started!
              </div>
            )}

            {loadingMore && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Home;
